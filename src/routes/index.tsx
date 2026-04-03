import MainContent from '#/components/reusable/containers/main-content'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, ChevronRight, Target, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <MainContent>
      <Hero />
      <Features />
    </MainContent>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center">
      <div className="text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
        <Zap className="text-primary h-3 w-3" />
        Free practice · No signup required to browse
      </div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        Ace your exam with{' '}
        <span className="text-primary">focused MCQ practice</span>
      </h1>
      <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-lg">
        Chapter-wise, timed multiple-choice tests for UPSC, JEE, NEET, CAT and
        more. Simple interface. Zero distraction.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/courses"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          Browse Courses <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          to="/signup"
          className="hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors"
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
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-3">
        {[
          {
            icon: <Target className="text-primary h-5 w-5" />,
            title: 'Focused Practice',
            desc: 'Distraction-free MCQ interface with instant feedback.',
          },
          {
            icon: <Zap className="text-primary h-5 w-5" />,
            title: 'Timed Tests',
            desc: 'Realistic exam conditions with auto-submit on timeout.',
          },
          {
            icon: <BookOpen className="text-primary h-5 w-5" />,
            title: 'Multi-Exam Platform',
            desc: 'One platform for UPSC, JEE, NEET, CAT and more.',
          },
        ].map((f) => (
          <div key={f.title} className="flex gap-4">
            <div className="bg-primary/10 mt-1 h-fit rounded-md p-2">
              {f.icon}
            </div>
            <div>
              <h3 className="mb-1 font-semibold">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
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
      <h2 className="mb-2 text-2xl font-bold">Explore by exam category</h2>
      <p className="text-muted-foreground mb-8">
        Pick your target and start practising today.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/courses`}
            className="group hover:border-primary hover:bg-primary/5 flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="group-hover:text-primary text-sm font-medium transition-colors">
              {cat.name}
            </span>
            <span className="text-muted-foreground text-xs">{cat.exams}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
