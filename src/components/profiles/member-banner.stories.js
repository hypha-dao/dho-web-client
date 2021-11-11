import MemberBanner from './member-banner.vue'

export default {
  title: 'Profile/Member Banner',
  component: MemberBanner,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MemberBanner },
  template: `
    <member-banner v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
