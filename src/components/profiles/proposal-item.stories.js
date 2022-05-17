// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import ProposalItem from './proposal-item.vue'

export default {
  title: 'Profiles/ Proposal Item',
  component: ProposalItem,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalItem },
  template: `
    <proposal-item v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {
  proposal: {
    details_state_s: 'rejected',
    __typename: 'Payout',
    details_title_s: 'This is a title'
  },
  votingPercentages: {
    quorum: 0.5
  }
}
