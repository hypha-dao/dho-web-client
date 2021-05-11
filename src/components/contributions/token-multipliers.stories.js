import TokenMultipliers from './token-multipliers.vue'

export default {
  title: 'Contributions/Token Multipliers',
  component: TokenMultipliers,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TokenMultipliers },
  template: `
    <token-multipliers v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  seeds: 1,
  husd: 1.2,
  hvoice: 1.1,
  hypha: 1
}

export const Base = Template.bind({})
