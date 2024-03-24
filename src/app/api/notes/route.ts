import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from '@/data/schemas/note'
import { getEmbedding } from '@/lib/openai'
import { notesIndex } from '@/lib/pinecone'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsedResult = createNoteSchema.safeParse(body)

    if (!parsedResult.success) {
      return Response.json({ error: parsedResult.error }, { status: 400 })
    }

    const { title, content } = parsedResult.data

    const { userId } = auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const embedding = await getEmbeddingForNote(title, content)

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      })

      await notesIndex.upsert([{ id: note.id, values: embedding, metadata: { userId } }])

      return note
    })

    return Response.json(note, { status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const parsedResult = updateNoteSchema.safeParse(body)

    if (!parsedResult.success) {
      return Response.json({ error: parsedResult.error }, { status: 400 })
    }

    const { id, title, content } = parsedResult.data

    const note = await prisma.note.findUnique({ where: { id } })

    if (!note) {
      return Response.json({ error: 'Note not found' }, { status: 404 })
    }

    const { userId } = auth()

    if (!userId || userId !== note.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const embedding = await getEmbeddingForNote(title, content)

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      })

      await notesIndex.upsert([{ id, values: embedding, metadata: { userId } }])

      return updatedNote
    })

    return Response.json(updatedNote, { status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()

    const parsedResult = deleteNoteSchema.safeParse(body)

    if (!parsedResult.success) {
      return Response.json({ error: parsedResult.error }, { status: 400 })
    }

    const { id } = parsedResult.data

    const note = await prisma.note.findUnique({ where: { id } })

    if (!note) {
      return Response.json({ error: 'Note not found' }, { status: 404 })
    }

    const { userId } = auth()

    if (!userId || userId !== note.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({ where: { id } })
      await notesIndex.deleteOne(id)
    })

    return Response.json({ message: 'Note deleted', status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + '\n\n' + (content ?? '')).then((embedding) => {
    return embedding
  })
}
