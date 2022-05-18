// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import NonMemberMenu from './non-member-menu.vue'

export default {
  title: 'Navigation/ Non Member Menu',
  component: NonMemberMenu,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NonMemberMenu },
  template: `
    <non-member-menu v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {
}
