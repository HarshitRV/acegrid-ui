import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, ChevronRight, Target, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="flex flex-col justify-evenly">
      <Hero />
      <Features />
    </main>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
        <Zap className="h-3 w-3 text-primary" />
        Free practice · No signup required to browse
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
        Ace your exam with{' '}
        <span className="text-primary">focused MCQ practice</span>
      </h1>
      <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8">
        Chapter-wise, timed multiple-choice tests for UPSC, JEE, NEET, CAT and
        more. Simple interface. Zero distraction.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Browse Courses <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
        >
          Create free account
        </Link>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {[
          {
            icon: <Target className="h-5 w-5 text-primary" />,
            title: 'Focused Practice',
            desc: 'Distraction-free MCQ interface with instant feedback.',
          },
          {
            icon: <Zap className="h-5 w-5 text-primary" />,
            title: 'Timed Tests',
            desc: 'Realistic exam conditions with auto-submit on timeout.',
          },
          {
            icon: <BookOpen className="h-5 w-5 text-primary" />,
            title: 'Multi-Exam Platform',
            desc: 'One platform for UPSC, JEE, NEET, CAT and more.',
          },
        ].map((f) => (
          <div key={f.title} className="flex gap-4">
            <div className="mt-1 rounded-md bg-primary/10 p-2 h-fit">
              {f.icon}
            </div>
            <div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Categories() {
  const categories = [
    {
      name: 'Government',
      emoji: '🏛️',
      slug: 'government',
      exams: 'UPSC, SSC, State PSC',
    },
    {
      name: 'Engineering',
      emoji: '⚙️',
      slug: 'engineering',
      exams: 'JEE Main, JEE Advanced',
    },
    { name: 'Medical', emoji: '🩺', slug: 'medical', exams: 'NEET UG, AIIMS' },
    {
      name: 'Management',
      emoji: '📊',
      slug: 'management',
      exams: 'CAT, XAT, GMAT',
    },
    {
      name: 'Banking',
      emoji: '🏦',
      slug: 'banking',
      exams: 'IBPS, SBI PO, RBI',
    },
    {
      name: 'Languages',
      emoji: '📚',
      slug: 'language',
      exams: 'IELTS, TOEFL, DELF',
    },
  ] as const

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-bold mb-2">Explore by exam category</h2>
      <p className="text-muted-foreground mb-8">
        Pick your target and start practising today.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/courses`}
            className="group flex flex-col items-center gap-2 rounded-xl border p-4 text-center hover:border-primary hover:bg-primary/5 transition-all"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              {cat.name}
            </span>
            <span className="text-xs text-muted-foreground">{cat.exams}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
