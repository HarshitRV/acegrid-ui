import { createFileRoute } from '@tanstack/react-router'
import MainContent from '#/components/reusable/main-content'
import Auth from '#/components/auth/auth'

export const Route = createFileRoute('/signup')({
  component: SignUp,
})

function SignUp() {
  return (
    <MainContent>
      <Auth type="register" />
    </MainContent>
  )
}
