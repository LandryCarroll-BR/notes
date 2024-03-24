import { getEmbedding, openai } from '@/lib/openai'
import { notesIndex } from '@/lib/pinecone'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { ChatCompletionMessage } from 'openai/resources/index.mjs'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Note } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const messages: ChatCompletionMessage[] = body.messages

    const messagesTrucated = messages.slice(-6)

    console.log(messagesTrucated)

    const embedding = await getEmbedding(messagesTrucated.map((message) => message.content).join('\n'))

    const { userId } = auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    })

    const relevantNotes = await prisma.note.findMany({
      where: { id: { in: vectorQueryResponse.matches.map((match) => match.id) } },
    })

    console.log('relevantNotes', relevantNotes)

    const systemMessage: ChatCompletionMessage = {
      role: 'assistant',
      content:
        "You are an intelligent note-taking app. You answer the user's question based on their existing notesIndex." +
        'The relevnt notes for this query are:\n' +
        relevantNotes.map((note: Note) => `Title: ${note.title}\n\n Content:\n${note.content}`).join('\n\n'),
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [systemMessage, ...messagesTrucated],
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error)
  }
}
