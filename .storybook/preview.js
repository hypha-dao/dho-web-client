import 'quasar/dist/quasar.min.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import iconSet from 'quasar/icon-set/fontawesome-v5'

import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'

// import 'quasar/dist/quasar.styl'
import '../src/css/quasar.variables.styl'
import '../src/css/app.styl'

import Vue from 'vue'
import Quasar from 'quasar'

Vue.component('q-markdown', QMarkdown)

Vue.use(Quasar, {
  iconSet: iconSet,
})

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  }
}
