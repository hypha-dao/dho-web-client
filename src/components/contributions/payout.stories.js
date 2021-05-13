import Payout from './payout.vue'

export default {
  title: 'Contributions/Payout',
  component: Payout,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Payout },
  template: `
    <payout v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
