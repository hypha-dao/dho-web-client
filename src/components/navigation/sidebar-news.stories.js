// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import SidebarNews from './sidebar-news.vue'

export default {
  title: 'Navigation/ Sidebar News',
  component: SidebarNews,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SidebarNews },
  template: `
    <sidebar-news v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {
  daoName: 'TEST DAO',
  username: 'username',
  isMember: true
}
