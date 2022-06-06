import ProfileTabs from './profile-tabs.vue'

export default {
  title: 'Profiles/Profile Tabs',
  component: ProfileTabs,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProfileTabs },
  template: `
    <profile-tabs v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {

}

export const Base = Template.bind({})
