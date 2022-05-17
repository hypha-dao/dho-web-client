// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import InfoTooltip from './info-tooltip.vue'

export default {
  title: 'Common/ Info Tooltip',
  component: InfoTooltip,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { InfoTooltip },
  template: `
    <info-tooltip v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {
  tooltip: 'This is a tooltip'
}

export const Base = Template.bind({})
