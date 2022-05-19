// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import EditControls from './edit-controls.vue'

export default {
  title: 'Common/ Edit Controls',
  component: EditControls
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { EditControls },
  template: `
    <edit-controls v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {

}

export const Base = Template.bind({})
