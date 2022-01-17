import TreasuryWidget from './treasury-widget.vue'

export default {
  title: 'organization/Treasury Widget',
  component: TreasuryWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TreasuryWidget },
  template: `
    <treasury-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  tokens: [
    {
      logo: '',
      tokenName: 'USD',
      amount: 12.3
    },
    {
      logo: '',
      tokenName: 'USD',
      amount: 12.3
    },
    {
      logo: '',
      tokenName: 'USD',
      amount: 12.3
    }
  ]
}

export const Base = Template.bind({})
