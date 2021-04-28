import PersonalInfo from './personal-info.vue'

export default {
  title: 'Profiles/Personal Info',
  component: PersonalInfo,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PersonalInfo },
  template: `
    <personal-info v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  joined: '2021-03-01T00:34:33.500',
  publicData: {
    avatar: 'avatar-placeholder.png',
    name: 'Johnny Cage',
    tags: ['celeb', 'fighter', 'sunglasses', 'mk1', 'splits'],
    timeZone: 'Pacific Standard Time'
  },
  username: 'johnnyhypha1'
}

export const Base = Template.bind({})
