import SettingsCommunity from './settings-community.vue'

export default {
  title: 'Dao/Settings Community',
  component: SettingsCommunity,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SettingsCommunity },
  template: `
    <settings-community v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  form: {
    communityVotingEnabled: false,
    communityVotingMethod: 'CLASSIC',
    upvoteStartDateTime: '',
    upvoteStartDate: '',
    upvoteStartTime: '',
    upvoteDuration: 7890000,
    upvoteRounds: [{ peoplePassing: 50, duration: 10800 }],
    upvoteCheifDelegateCount: 4,
    upvoteCheifDelegateDuration: 10800,
    upvoteHeadDelegateRound: false,
    upvoteHeadDelegateDuration: 10800,
    communityVotingDurationSec: 604800,
    communityVotingAlignmentPercent: 20,
    communityVotingQuorumPercent: 50
  },

  isAdmin: true
}

export const Base = Template.bind({})
Base.args = {
  form: {
    communityVotingEnabled: false,
    communityVotingMethod: 'CLASSIC',
    upvoteStartDateTime: '',
    upvoteStartDate: '',
    upvoteStartTime: '',
    upvoteDuration: 7890000,
    upvoteRounds: [{ peoplePassing: 50, duration: 10800 }],
    upvoteCheifDelegateCount: 4,
    upvoteCheifDelegateDuration: 10800,
    upvoteHeadDelegateRound: false,
    upvoteHeadDelegateDuration: 10800,
    communityVotingDurationSec: 604800,
    communityVotingAlignmentPercent: 20,
    communityVotingQuorumPercent: 50
  },

  isAdmin: true
}
