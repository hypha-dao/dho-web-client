import Voting from './voting.vue'
import Vuex from 'vuex'
export default {
  title: 'Proposals/Voting',
  component: Voting,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Voting },
  template: `
    <voting v-bind="$props" />
  `,
  store: new Vuex.Store({
    modules: {
      accounts: {
        namespaced: true,
        state: {},
        getters: {
          isMember: (state) => {
            return true
          }
        }
      },
      dao: {
        namespaced: true,
        state: {},
        getters: {
          votingPercentages: (state) => {
            return {
              voting: 80,
              quorum: 20
            }
          }
        }
      }
    }
  })
})

export const Example = Template.bind({})
Example.args = {

}

export const Base = Template.bind({})
