// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import WidgetEditable from './widget-editable.vue'

export default {
  title: 'Common/ Widget Editable',
  component: WidgetEditable,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { WidgetEditable },
  template: `
    <div style="{width='50%'}">
      <widget-editable v-bind="$props" />
    </div>
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {
  title: 'Widget Editable',
  editable: true,
  noPadding: false
}

export const Base = Template.bind({})
