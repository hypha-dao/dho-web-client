import HowItWorks from './how-it-works.vue'

export default {
  title: 'dashboard/How it works',
  component: HowItWorks,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HowItWorks },
  template: `
    <how-it-works v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
