// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import ProfileSidebarGuest from './profile-sidebar-guest.vue'

export default {
  title: 'Navigation/ Profile Sidebar Guest',
  component: ProfileSidebarGuest,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProfileSidebarGuest },
  template: `
    <div :style="{height:'800px', width:'250px'}">
      <profile-sidebar-guest v-bind="$props" />
    </div>
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {
  daoName: 'TEST DAO'
}
