import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Link, useNavigate } from '@tanstack/react-router'
import { BookOpen, Loader2, LogOut } from 'lucide-react'
import ThemeToggle from './theme-toggle'
import { useAuth } from '#/services/hooks/auth'
import { SESSION_STORAGE_AUTH_TOKEN_KEY } from '#/constants'

export default function Header() {
  return (
    <header className="border-b p-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-primary flex items-center gap-2 font-semibold"
        >
          <BookOpen className="h-5 w-5" />
          <span>Ace Grid</span>
        </Link>
        <div className="flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/courses">Courses</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <UserMenu />
            </NavigationMenuList>
          </NavigationMenu>
          <UserInfo />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function UserInfo() {
  const { user, isFetching } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    typeof window !== 'undefined'
      ? sessionStorage.removeItem(SESSION_STORAGE_AUTH_TOKEN_KEY)
      : null
    navigate({
      to: '/',
    })
  }

  if (isFetching) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  if (user) {
    return (
      <>
        <div className="bg-background flex items-center gap-2 rounded-full border py-1 pr-3 pl-1.5 shadow-sm">
          <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold uppercase">
            {user.name.charAt(0)}
          </div>
          <span className="text-foreground hidden text-sm font-medium sm:block">
            {user.name}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </>
    )
  }

  return null
}

function UserMenu() {
  const { user } = useAuth()

  if (user) {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link to="/">Dashboard</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  }

  return (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link to="/login">Login</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link to="/signup">Signup</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  )
}
