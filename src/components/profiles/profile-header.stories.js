import ProfileHeader from './profile-header.vue'

export default {
  title: 'Profiles/Profile Header',
  component: ProfileHeader,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProfileHeader },
  template: `
    <profile-header v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  name: 'Johnny Cage',
  size: '64px',
  username: 'johnnyhypha1'
}

export const Base = Template.bind({})
