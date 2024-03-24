import { Box, Flex } from '@/components/layout'
import { Heading, Lead } from '@/components/typography'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Home() {
  return (
    <Flex className="min-h-screen items-center justify-center pb-48">
      <Flex className="mx-auto flex-col items-center justify-center gap-4 text-center">
        <Heading as="h1">Welcome to Notes</Heading>
        <Lead>A helpful notetaking app with AI functionality</Lead>
        <Button asChild className="w-fit">
          <Link href={'/dashboard'}>Start taking notes</Link>
        </Button>
      </Flex>
    </Flex>
  )
}
