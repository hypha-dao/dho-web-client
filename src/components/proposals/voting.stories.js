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

export const Gest = Template.bind({})
Gest.args = {
  unity: 0.85,
  quorum: 0.15,
  expiration: '20/May/2122',
  stagin: false,
  vote: null,
  status: 'proposed'
}

export const Base = Template.bind({})
Base.args = {
  ...Gest.args,
  activeButtons: true
}

export const BaseVotePass = Template.bind({})
BaseVotePass.args = {
  ...Gest.args,
  activeButtons: true,
  vote: 'pass'
}

export const BaseVoteAbstain = Template.bind({})
BaseVoteAbstain.args = {
  ...Gest.args,
  activeButtons: true,
  vote: 'abstain'
}

export const BaseVoteFail = Template.bind({})
BaseVoteFail.args = {
  ...Gest.args,
  activeButtons: true,
  vote: 'fail'
}

export const Approved = Template.bind({})
Approved.args = {
  ...Gest.args,
  activeButtons: true,
  status: 'approved',
  expiration: '8/May/2022'
}

export const Apply = Template.bind({})
Apply.args = {
  ...Gest.args,
  activeButtons: true,
  status: 'approved',
  unity: 0.50,
  quorum: 0.85,
  type: 'Badge',
  expiration: '8/May/2022'
}

export const Withdraw = Template.bind({})
Withdraw.args = {
  ...Gest.args,
  status: 'approved',
  active: true,
  type: 'Badge',
  expiration: '8/May/2022'
}

export const Suspended = Template.bind({})
Suspended.args = {
  ...Gest.args,
  activeButtons: true,
  status: 'suspended',
  expiration: '8/May/2022'
}

export const Archived = Template.bind({})
Archived.args = {
  ...Gest.args,
  status: 'rejected',
  expiration: '8/May/2022'
}

export const Withdrawed = Template.bind({})
Withdrawed.args = {
  ...Gest.args,
  status: 'withdrawed',
  expiration: '8/May/2022'
}
