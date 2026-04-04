import { Link, useNavigate } from '@tanstack/react-router'
import { LoginInputSchema, RegisterInputSchema } from '#/types/user'
import { useLogin, useRegister } from '#/services/hooks/auth'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { FieldGroup } from '#/components/ui/field'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useAppForm } from '../ui/app-form'
import { SESSION_STORAGE_AUTH_TOKEN_KEY } from '#/constants'

interface AuthProps {
  type: 'login' | 'register'
}

export default function Auth({ type }: AuthProps) {
  const authContent = getAuthContent(type)
  const navigate = useNavigate()
  const {
    mutate: loginMutation,
    error: loginError,
    isPending: loginPending,
  } = useLogin()
  const {
    mutate: registerMutation,
    error: registerError,
    isPending: registerPending,
  } = useRegister()

  const error = type === 'login' ? loginError : registerError
  const isPending = type === 'login' ? loginPending : registerPending

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        duration: Number.POSITIVE_INFINITY,
        closeButton: true,
      })
    }
  }, [error])

  const form = useAppForm({
    defaultValues: authContent.defaultValues,
    validators: {
      onSubmit: authContent.validationSchema,
    },
    onSubmit: async ({ value }) => {
      if (type === 'register' && value.name) {
        registerMutation(value, {
          onSuccess: (data) => {
            sessionStorage.setItem(
              SESSION_STORAGE_AUTH_TOKEN_KEY,
              data.accessToken,
            )
            navigate({ to: '/' })
          },
        })

        return
      }

      loginMutation(value, {
        onSuccess: (data) => {
          sessionStorage.setItem(
            SESSION_STORAGE_AUTH_TOKEN_KEY,
            data.accessToken,
          )
          navigate({ to: '/' })
        },
      })
    },
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">{authContent.title}</CardTitle>
        <CardDescription>{authContent.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id={`${type}-form`}
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            {type === 'register' && (
              <form.AppField
                name="name"
                children={(field) => {
                  return (
                    <field.TextField
                      label="Name"
                      placeholder="Your name"
                      autoComplete="name"
                      required
                    />
                  )
                }}
              />
            )}
            <form.AppField
              name="email"
              children={(field) => {
                return (
                  <field.TextField
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                )
              }}
            />

            <form.AppField
              name="password"
              children={(field) => {
                return (
                  <field.TextField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    description="Must be at least 8 characters."
                    autoComplete="current-password"
                    required
                  />
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          type="submit"
          form={`${type}-form`}
          className="w-full"
          size="lg"
          disabled={isPending}
        >
          {isPending ? 'Submitting...' : authContent.buttonText}
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          {authContent.promptText}{' '}
          <Link
            to={authContent.linkTo}
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            {authContent.linkText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

const getAuthContent = (type: AuthProps['type']) => {
  switch (type) {
    case 'login':
      return {
        title: 'Log in',
        description: 'Enter your email and password to log in',
        buttonText: 'Log in',
        promptText: "Don't have an account?",
        linkText: 'Sign up',
        linkTo: '/signup',
        validationSchema: LoginInputSchema,
        defaultValues: {
          email: '',
          password: '',
        },
      }
    case 'register':
      return {
        title: 'Sign up',
        description: 'Enter your email and password to sign up',
        buttonText: 'Sign up',
        promptText: 'Already have an account?',
        linkText: 'Log in',
        linkTo: '/login',
        validationSchema: RegisterInputSchema,
        defaultValues: {
          name: '',
          email: '',
          password: '',
        },
      }
  }
}
