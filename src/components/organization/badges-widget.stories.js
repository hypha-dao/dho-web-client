import BadgesWidget from './badges-widget.vue'
import Vuex from 'vuex'

export default {
  title: 'organization/Badges Widget',
  component: BadgesWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { BadgesWidget },
  template: `
    <badges-widget v-bind="$props" />
  `,
  store: new Vuex.Store({
    modules: {
      accounts: {
        namespaced: true,
        state: {},
        getters: {
          isMember: (state) => {
            return false
          }
        }
      }
    }
  })
})

export const Example = Template.bind({})
Example.args = {
  badges: [
    {
      title: 'Badge',
      description: 'Description',
      icon: 'icon',
      assignments: []
    },
    {
      title: 'Badge - 2',
      description: 'Description',
      icon: 'icon',
      assignments: []
    },
    {
      title: 'Badge - 3',
      description: 'Description',
      icon: 'icon',
      assignments: []
    }
  ]
}

export const Default = Template.bind({})
