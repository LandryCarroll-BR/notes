import { ClerkProvider } from '@clerk/nextjs'

function Providers({ children }: React.PropsWithChildren) {
  return <ClerkProvider>{children}</ClerkProvider>
}
export { Providers }
