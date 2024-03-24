import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Bot, Home, LineChart, Menu, NotebookIcon, Package, Package2, Search, ShoppingCart, Users } from 'lucide-react'

import { Badge } from '@/ui/badge'
import { Input } from '@/ui/input'
import { Button } from '@/ui/button'
import { Box, Flex, Grid } from '@/components/layout'
import { Sheet, SheetContent, SheetTrigger } from '@/ui/sheet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { AddEditNoteDialog } from './add-edit-note-dialog'
import { Note } from '@/components/note'
import { Note as NoteModel } from '@prisma/client'
import { AIChatBox, AIChatBoxContent, AIChatBoxTrigger } from './ai-chat-box'

export function Dashboard({ notes }: { notes: NoteModel[] }) {
  return (
    <Grid className="min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Box className="hidden border-r bg-muted/40 md:block">
        <Flex className="h-full max-h-screen flex-col gap-2">
          <Flex className="h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <NotebookIcon className="h-6 w-6" />
              <span className="">Notes</span>
            </Link>
          </Flex>
          <Box className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </nav>
          </Box>
        </Flex>
      </Box>
      <Flex className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
              </nav>
              <Box className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </SheetContent>
          </Sheet>
          <Box className="w-full flex-1">
            <form>
              <Box className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notes..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </Box>
            </form>
          </Box>
          <UserButton afterSignOutUrl="/sign-in" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Flex className="w-full items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Notes</h1>
            <Flex className="ml-auto gap-2">
              <AddEditNoteDialog>
                <Button>Add Note</Button>
              </AddEditNoteDialog>
              <AIChatBox>
                <AIChatBoxTrigger variant={'secondary'} className="gap-2">
                  <Bot className="h-4 w-4" />
                  Chat with AI
                </AIChatBoxTrigger>
                <AIChatBoxContent />
              </AIChatBox>
            </Flex>
          </Flex>
          {notes.length === 0 && (
            <Flex className="flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
              <Flex className="flex-col items-center gap-1 text-center">
                <h2 className="text-2xl font-bold tracking-tight">You have no notes</h2>
                <p className="pb-2 text-sm text-muted-foreground">
                  You can start writing as soon as you add a new note.
                </p>
                <AddEditNoteDialog>
                  <Button>Add Note</Button>
                </AddEditNoteDialog>
              </Flex>
            </Flex>
          )}
          <Grid className="gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Note note={note} key={note.id} />
            ))}
          </Grid>
        </main>
      </Flex>
    </Grid>
  )
}
