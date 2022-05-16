// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import TextInputToggle from './text-input-toggle.vue'

export default {
  title: 'Form/ Text Input Toggle',
  component: TextInputToggle,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TextInputToggle },
  template: `
    <text-input-toggle v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  type: 'text',
  icon: 'fas fa-eye',
  text: 'Text',
  toogle: false,
  iconBackground: false
}
