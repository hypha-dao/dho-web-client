import QuickLinks from './quick-links.vue'
import Vuex from 'vuex'

export default {
  title: 'Navigation/Quick Links',
  component: QuickLinks,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuickLinks },
  template: `
    <quick-links v-bind="$props" />
  `,
  store: new Vuex.Store({
    getters: {
      state: {
        name: 'bestDao'
      },
      selectedDao (state) {
        return {
          name: 'bestDao',
          docId: 21
        }
      }
    }
  })
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
