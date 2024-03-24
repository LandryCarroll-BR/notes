import { Flex } from '@/components/layout'
import { SignIn } from '@clerk/nextjs'

export default async function SignInPage() {
  return (
    <Flex className="h-screen items-center justify-center">
      <SignIn appearance={{ variables: { colorPrimary: '#0f172a' } }} />
    </Flex>
  )
}
