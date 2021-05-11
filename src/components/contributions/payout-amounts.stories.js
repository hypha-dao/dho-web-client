import PayoutAmounts from './payout-amounts.vue'

export default {
  title: 'Contributions/Payout Amounts',
  component: PayoutAmounts,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PayoutAmounts },
  template: `
    <payout-amounts v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  husd: 1745.45,
  hvoice: 5124.24,
  hypha: 120.32
}

export const Base = Template.bind({})
