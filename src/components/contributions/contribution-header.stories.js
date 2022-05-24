// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import ContributionHeader from './contribution-header.vue'

export default {
  title: 'Contributions/ Contribution Header',
  component: ContributionHeader,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ContributionHeader },
  template: `
    <contribution-header v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {
  title: 'This is a title',
  state: 'rejected',
  created: new Date()
}
