import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import I18n from '../utils/i18n'

export default ({ app }) => {
  app.i18n = I18n
}
