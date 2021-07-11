import ProfileSidebar from './profile-sidebar.vue'

export default {
  title: 'Navigation/Profile Sidebar',
  component: ProfileSidebar,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProfileSidebar },
  template: `
    <profile-sidebar v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
