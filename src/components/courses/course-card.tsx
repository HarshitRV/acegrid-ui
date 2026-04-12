import { Link } from '@tanstack/react-router'
import { BookOpen, ChevronRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import type { Course } from '#/types/course'

const MAX_VISIBLE_TAGS = 2

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to="/courses/$courseSlug"
      params={{ courseSlug: course.slug }}
      className="block rounded-lg transition-all *:h-full hover:shadow-sm"
    >
      <Card className="group hover:ring-primary h-full justify-between transition-all">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="group-hover:text-primary leading-snug transition-colors">
              {course.title}
            </CardTitle>
            <BookOpen className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {course.description}
          </p>
        </CardContent>

        <CardFooter className="justify-between">
          <div className="flex flex-wrap gap-1">
            {(course.tags || []).slice(0, MAX_VISIBLE_TAGS).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            {course.examCount} exams
            <ChevronRight className="size-3" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
