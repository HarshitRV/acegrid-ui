import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'

interface AuthProps {
  type: 'login' | 'register'
  title: string
  description: string
}

export default function Auth({ type, title, description }: AuthProps) {
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

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = authContent.validationSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues[0]?.message || 'Validation failed'
        }
      },
    },
    onSubmit: async ({ value }) => {
      if (type === 'login') {
        loginMutation(value, {
          onSuccess: (data) => {
            sessionStorage.setItem('auth_token', data.accessToken)
            navigate({ to: '/' })
          },
        })

        return
      }

      registerMutation(value, {
        onSuccess: (data) => {
          sessionStorage.setItem('auth_token', data.accessToken)
          navigate({ to: '/' })
        },
      })
    },
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-destructive/10 text-destructive mb-4 rounded-md px-3 py-2 text-sm">
            {error.message}
          </div>
        )}

        <form
          id={`${type}-form`}
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            {type === 'register' && (
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            )}
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      id="login-email"
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Input
                      id="login-password"
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <FieldDescription>
                      Must be at least 8 characters.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
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
      }
  }
}
