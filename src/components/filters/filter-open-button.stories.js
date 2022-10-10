// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import FilterOpenButton from './filter-open-button.vue'

export default {
  title: 'Filters/ Filter Open Button',
  component: FilterOpenButton,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FilterOpenButton },
  template: `
    <filter-open-button v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {

}

export const Base = Template.bind({})
