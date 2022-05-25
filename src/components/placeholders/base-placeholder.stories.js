// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import BasePlaceholder from './base-placeholder.vue'

export default {
  title: 'Placeholders/ Base Placeholder',
  component: BasePlaceholder,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { BasePlaceholder },
  template: `
    <base-placeholder v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {
  title: 'This is a title',
  subtitle: 'This is a subtitle',
  icon: 'fas fa-eye',
  actionButtons: [{ label: 'button1', color: 'red' }]
}
