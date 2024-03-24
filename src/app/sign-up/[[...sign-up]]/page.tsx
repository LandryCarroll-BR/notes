import { Flex } from '@/components/layout'
import { SignUp } from '@clerk/nextjs'

export default async function SignUpPage() {
  return (
    <Flex className="h-screen items-center justify-center">
      <SignUp appearance={{ variables: { colorPrimary: '#0f172a' } }} />
    </Flex>
  )
}
