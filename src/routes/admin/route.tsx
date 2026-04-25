import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { BookOpen, FileText, HelpCircle } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

const navItems = [
  {
    to: '/admin/courses',
    label: 'Courses',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    to: '/admin/exams',
    label: 'Exams',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    to: '/admin/questions',
    label: 'Questions',
    icon: <HelpCircle className="h-4 w-4" />,
  },
]

function AdminLayout() {
  return (
    <div className="flex h-full">
      <aside className="bg-muted/30 hidden w-52 shrink-0 border-r px-3 py-6 sm:block">
        <p className="text-muted-foreground mb-4 px-2 text-xs font-semibold tracking-widest uppercase">
          Admin
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-muted-foreground hover:bg-muted hover:text-foreground [&.active]:bg-primary [&.active]:text-primary-foreground [&.active]:hover:bg-primary [&.active]:hover:text-primary-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
