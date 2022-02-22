import ProposalBanner from './proposal-banner.vue'
import Vuex from 'vuex'
export default {
  title: 'Proposals/Banner',
  component: ProposalBanner,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalBanner },
  template: `
    <proposal-banner v-bind="$props" />
  `,
  store: new Vuex.Store({
    modules: {
      dao: {
        namespaced: true,
        state: {},
        getters: {
          selectedDao: (state) => {
            return {
              name: 'lorem',
              docId: '',
              hash: ''
            }
          }
        }
      }
    }
  })
})

export const Example = Template.bind({})
Example.args = {
  isMember: true
}

export const Base = Template.bind({})
Example.args = {
  isMember: false
}
