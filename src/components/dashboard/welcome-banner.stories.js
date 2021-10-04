import WelcomeBanner from './welcome-banner.vue'

export default {
  title: 'dashboard/Welcome Banner',
  component: WelcomeBanner,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { WelcomeBanner },
  template: `
    <welcome-banner v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
