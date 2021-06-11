import ProfilePicture from './profile-picture.vue'

export default {
  title: 'Profiles/Profile Picture',
  component: ProfilePicture,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProfilePicture },
  template: `
    <profile-picture v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  avatar: 'avatar-placeholder.png',
  size: '200px',
  username: 'johnnyhypha1'
}

export const Base = Template.bind({})
