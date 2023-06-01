import Tokens from './tokens.vue'

export default {
  title: 'organization/Tokens',
  component: Tokens,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Tokens },
  template: `
    <tokens v-bind="$props" />
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
