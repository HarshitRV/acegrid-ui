import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminIndex,
})

function AdminIndex() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the admin area. Select an option from the sidebar to
        continue.
      </p>
    </div>
  )
}
