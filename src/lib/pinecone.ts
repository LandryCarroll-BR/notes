import { Pinecone } from '@pinecone-database/pinecone'

const apiKey = process.env.PINECONE_API_KEY

if (!apiKey) {
  throw new Error('PINECONE_API_KEY not set')
}

const pinecone = new Pinecone({ apiKey })

export const notesIndex = pinecone.index('notes')
