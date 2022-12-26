import BillingHistoryCard from './billing-history-card.vue'

export default {
  title: 'Plan/Billing history card',
  component: BillingHistoryCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { BillingHistoryCard },
  template: `
    <downgrade-pop-up v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  value: true
}

export const Base = Template.bind({})
