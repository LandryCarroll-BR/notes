import { Note as NoteModel } from '@prisma/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { AddEditNoteDialog } from './add-edit-note-dialog'
import { Button } from './ui/button'

interface NoteProps {
  note: NoteModel
}

function Note({ note }: NoteProps) {
  const wasUpdated = note.updatedAt > note.createdAt

  const createdUpdatedAtTimestamp = (wasUpdated ? note.updatedAt : note.createdAt).toDateString()

  return (
    <AddEditNoteDialog noteToEdit={note}>
      <Card className="flex cursor-pointer flex-col transition-colors hover:bg-muted">
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>{createdUpdatedAtTimestamp}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="prose">{note.content}</p>
        </CardContent>
      </Card>
    </AddEditNoteDialog>
  )
}

export { Note }
