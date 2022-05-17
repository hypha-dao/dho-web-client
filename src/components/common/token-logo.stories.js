import TokenLogo from './token-logo.vue'

export default {
  title: 'Common/Token Logo',
  component: TokenLogo,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TokenLogo },
  template: `
    <token-logo v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  type: 'utility'
}

export const Seeds = Template.bind({})
Seeds.args = {
  type: 'cash'
}

export const Hypha = Template.bind({})
Hypha.args = {
  type: 'voice'
}
