'use client'

import * as React from 'react'
import { Message, useChat } from 'ai/react'

import { Box, Flex } from './layout'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from './ui/button'
import { Input } from './ui/input'
import { Bot, XIcon } from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarImage } from './ui/avatar'

type AIChatBoxContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AIChatBoxContext = React.createContext<AIChatBoxContextValue | undefined>(undefined)

function useAIChatBox() {
  const context = React.useContext(AIChatBoxContext)
  if (!context) {
    throw new Error('useAIChatBox must be used within a AIChatBoxProvider')
  }
  return context
}

function AIChatBox({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return <AIChatBoxContext.Provider value={{ open, setOpen }}>{children}</AIChatBoxContext.Provider>
}

interface AIChatBoxContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function AIChatBoxContent({ children, ...props }: AIChatBoxContentProps) {
  const { open } = useAIChatBox()
  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error } = useChat()

  return (
    <Box
      className={cn('bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36', open ? 'fixed' : 'hidden')}
      {...props}
    >
      <AIChatBoxCloseButton
        className="absolute right-0 top-0 m-2 h-6 w-6 rounded-lg p-1"
        size={'icon'}
        variant={'ghost'}
      >
        <XIcon />
      </AIChatBoxCloseButton>
      <Flex className="h-[600px] flex-col rounded-xl border bg-background shadow-xl">
        <Box className="h-full p-3">
          <ScrollArea className="h-[480px]">
            {messages.map((message) => (
              <AIChatBoxMessage key={message.id} message={message} />
            ))}
          </ScrollArea>
        </Box>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input type="text" value={input} onChange={handleInputChange} placeholder="Say something..." />
          <Button type="submit">Send</Button>
        </form>
      </Flex>
    </Box>
  )
}

function AIChatBoxTrigger({ children, ...props }: ButtonProps) {
  const { setOpen } = useAIChatBox()

  return (
    <Button onClick={() => setOpen(true)} {...props}>
      {children}
    </Button>
  )
}

function AIChatBoxCloseButton({ children, ...props }: ButtonProps) {
  const { setOpen } = useAIChatBox()

  return (
    <Button onClick={() => setOpen(false)} {...props}>
      {children}
    </Button>
  )
}

function AIChatBoxMessage({ message: { role, content } }: { message: Message }) {
  const { user } = useUser()

  const isAiMessage = role === 'assistant'
  const isUserMessage = role === 'user'

  return (
    <Flex className={cn('mb-3 gap-3', isAiMessage && 'flex-row-reverse')}>
      <Box>
        {isUserMessage && (
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.imageUrl} />
          </Avatar>
        )}
        {isAiMessage && (
          <Avatar className="flex h-7 w-7 items-center justify-center bg-secondary">
            <Bot />
          </Avatar>
        )}
      </Box>
      <Box className={cn(isAiMessage && 'border', isUserMessage && 'bg-muted', 'rounded-lg p-2')}>{content}</Box>
    </Flex>
  )
}

export { AIChatBox, AIChatBoxContent, AIChatBoxTrigger, AIChatBoxCloseButton }
