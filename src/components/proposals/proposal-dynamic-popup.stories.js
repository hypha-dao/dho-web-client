// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import ProposalDynamicPopup from './proposal-dynamic-popup.vue'

export default {
  title: 'Proposals/ Proposal Dynamic Popup',
  component: ProposalDynamicPopup,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalDynamicPopup },
  template: `
    <proposal-dynamic-popup v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {
  title: 'Proposal Title',
  description: 'Proposal Description',
  min: 0,
  max: 100,
  step: 5,
  initialValue: 0
}
