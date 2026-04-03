import { createFileRoute } from '@tanstack/react-router'
import MainContent from '#/components/reusable/containers/main-content'
import Auth from '#/components/auth/auth'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <MainContent>
      <Auth type="login" />
    </MainContent>
  )
}
