import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/courses')({
  component: Courses,
})

function Courses() {
  return <div>Hello "/courses"!</div>
}
