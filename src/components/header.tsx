import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  GraduationCap,
  Loader2,
  LogOut,
  Shield,
} from 'lucide-react'
import ThemeToggle from './theme-toggle'
import { authKeys, useAuth } from '#/services/hooks/auth'
import { SESSION_STORAGE_AUTH_TOKEN_KEY } from '#/constants'
import { useQueryClient } from '@tanstack/react-query'

export default function Header() {
  return (
    <header className="border-b p-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-primary flex items-center gap-2 font-semibold"
        >
          <img src="/favicon.svg" alt="AceGrid Logo" className="h-6 w-6" />
          <span>AceGrid</span>
        </Link>
        <div className="flex items-center gap-2">
          <AuthNav />
          <UserNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function UserNav() {
  const queryClient = useQueryClient()
  const { user, isFetching } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    typeof window !== 'undefined'
      ? sessionStorage.removeItem(SESSION_STORAGE_AUTH_TOKEN_KEY)
      : null

    queryClient.setQueryData(authKeys.all, null)

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
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger noHover>
                <div className="bg-background flex items-center gap-2 rounded-full border py-1 pr-3 pl-1.5 shadow-sm">
                  <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-foreground hidden text-sm font-medium sm:block">
                    {user.name}
                  </span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1 p-2">
                  {user.role === 'admin' && (
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/courses"
                          className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors"
                          activeProps={{
                            className:
                              'bg-accent text-accent-foreground font-medium',
                          }}
                        >
                          <Shield className="h-4 w-4" />
                          Admin
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  )}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/dashboard"
                        className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors"
                        activeProps={{
                          className:
                            'bg-accent text-accent-foreground font-medium',
                        }}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/courses"
                        className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors"
                        activeProps={{
                          className:
                            'bg-accent text-accent-foreground font-medium',
                        }}
                      >
                        <GraduationCap className="h-4 w-4" />
                        Courses
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

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

function AuthNav() {
  const { user } = useAuth()

  if (user) {
    return null
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/courses">Courses</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
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
      </NavigationMenuList>
    </NavigationMenu>
  )
}
