import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/exams/')({
  component: AdminExams,
})

function AdminExams() {
  return <main></main>
}
