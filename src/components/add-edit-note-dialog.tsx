'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { CreateNoteSchema, createNoteSchema } from '@/data/schemas/note'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { LoadingButton } from './loading-button'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'
import { Button } from './ui/button'
import * as React from 'react'
import { Note } from '@prisma/client'
import { Flex } from './layout'

interface AddEditNoteDialogProps {
  children: React.ReactNode
  noteToEdit?: Note
}

function AddEditNoteDialog({ noteToEdit, children }: AddEditNoteDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const router = useRouter()

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { title: noteToEdit?.title ?? '', content: noteToEdit?.content ?? '' },
  })

  async function onSubmit(values: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch('/api/notes', {
          method: 'PUT',
          body: JSON.stringify({
            id: noteToEdit.id,
            ...values,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update note' + response.status)
        }
      } else {
        const response = await fetch('/api/notes', {
          method: 'POST',
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          throw new Error('Failed to create note' + response.status)
        }

        form.reset()
      }

      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteNote() {
    if (!noteToEdit) return
    try {
      setIsDeleting(true)
      const response = await fetch('/api/notes', {
        method: 'DELETE',
        body: JSON.stringify({ id: noteToEdit.id }),
      })
      if (!response.ok) {
        throw new Error('Failed to delete note' + response.status)
      }
      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? 'Edit Note' : 'Add Note'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="">
              {noteToEdit && (
                <LoadingButton
                  type="button"
                  loading={isDeleting}
                  onClick={deleteNote}
                  variant={'destructive'}
                  disabled={form.formState.isSubmitting}
                >
                  Delete Note
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={isDeleting}
                variant={'default'}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { AddEditNoteDialog }
