import { Dashboard } from '@/components/dashboard'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs'

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) throw new Error('userId undefined')

  const allNotes = await prisma.note.findMany({
    where: { userId },
  })

  return <Dashboard notes={allNotes} />
}
