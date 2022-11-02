import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

export default async ({ Vue, store, router }) => {
  Sentry.init({
    Vue,
    dsn: process.env.SENTRY_DSN,
    environment: process.env.CI_ENVIRONMENT_NAME,
    release: process.env.CI_COMMIT_SHORT_SHA,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', 'hypha.earth', /^\//]
      })
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })

  Vue.prototype.$sentry = Sentry
  store.$sentry = Sentry
}
