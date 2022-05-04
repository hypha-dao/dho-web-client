// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import ProposalCardChips from './proposal-card-chips.vue'

export default {
  title: 'Proposals/ Proposal Card Chips',
  component: ProposalCardChips,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalCardChips },
  template: `
    <proposal-card-chips v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {
  type: 'Payout',
  state: 'rejected'
}
