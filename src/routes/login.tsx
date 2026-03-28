import { createFileRoute } from '@tanstack/react-router'
import MainContent from '#/components/reusable/main-content'
import Auth from '#/components/auth/auth'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <MainContent>
      <Auth
        type="login"
        title="Welcome back"
        description="Log in to continue your practice"
      />
    </MainContent>
  )
}
