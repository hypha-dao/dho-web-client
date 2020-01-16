import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

export default async ({ Vue, store }) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new Integrations.Vue({ Vue, attachProps: true, logErrors: process.env.NODE_ENV !== 'production' })],
    environment: process.env.CI_ENVIRONMENT_NAME,
    release: process.env.CI_COMMIT_SHORT_SHA
  })
  Vue.prototype.$sentry = Sentry
  store['$sentry'] = Sentry
}
