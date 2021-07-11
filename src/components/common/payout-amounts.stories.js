import PayoutAmounts from './payout-amounts.vue'

export default {
  title: 'Common/Payout Amounts',
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
  tokens: [
    {
      label: 'husd',
      value: 1745.45
    },
    {
      label: 'hvoice',
      value: 5124.24
    },
    {
      label: 'hypha',
      value: 120.32
    }
  ]
}

export const Base = Template.bind({})
