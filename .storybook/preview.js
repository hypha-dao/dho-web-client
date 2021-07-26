import Vue from 'vue'
import VueRouter from 'vue-router'
import Quasar, { colors } from 'quasar'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import iconSet from 'quasar/icon-set/fontawesome-v5'

// Import all the quasar css
import 'quasar/dist/quasar.min.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '../src/css/app.styl'

// Set the quasar colors manually
// importing the stylus file does NOT work
colors.setBrand('primary', '#41405a')
colors.setBrand('secondary', '#00bfdf')
colors.setBrand('accent', '#5bd4ca')
colors.setBrand('positive', '#19bca1')
colors.setBrand('negative', '#f94848')
colors.setBrand('info', '#16b2d3')
colors.setBrand('warning', '#ffbf40')

Vue.component('q-markdown', QMarkdown)

Vue.use(Quasar, {
  iconSet: iconSet,
})
Vue.use(VueRouter)

export const decorators = [
  (story) => ({
    components: { story },
    template: `<story />`,
    router: new VueRouter()
  })
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /(now|Date)$/,
    },
  }
}
