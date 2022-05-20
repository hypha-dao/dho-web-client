// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import AssetCard from './asset-card.vue'

export default {
  title: 'Organization-asset/ Asset Card',
  component: AssetCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AssetCard },
  template: `
    <asset-card v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {
  asset: {
    title: 'Title',
    description: 'lorem ipsum dolor sit amet',
    assignmentAggregate: { count: 0 }
  }
}
