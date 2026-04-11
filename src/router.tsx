import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from '#/routeTree.gen'
import { QueryClient } from '@tanstack/react-query'
import { DefaultCatchBoundary } from '#/components/default-catch-boundary'
import { NotFound } from '#/components/not-found'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { FullScreenLoader } from '#/components/ui/full-screen-loader'

export function getRouter() {
  const queryClient = new QueryClient()

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: NotFound,
    defaultPendingComponent: FullScreenLoader,
    defaultPendingMinMs: 0,
    defaultPendingMs: 0,
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
