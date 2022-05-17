// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import AssetList from './asset-list.vue'

export default {
  title: 'Organization-asset/ Asset List',
  component: AssetList,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AssetList },
  template: `
    <div :styles="{width:'800px', height:'800px'}">
      <asset-list v-bind="$props" />
    </div>
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {
  assetList: [
    {
      title: 'Title',
      description: 'lorem ipsum dolor sit amet',
      assignmentAggregate: { count: 0 }
    },
    {
      title: 'Title 1',
      description: 'lorem ipsum dolor sit amet',
      assignmentAggregate: { count: 0 }
    },
    {
      title: 'Title 2',
      description: 'lorem ipsum dolor sit amet',
      assignmentAggregate: { count: 0 }
    }
  ]
}
