import MultiSig from './multi-sig.vue'

export default {
  title: 'Profiles/MultiSig',
  component: MultiSig,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MultiSig },
  template: `
    <multi-sig v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  numberOfPRToSign: 7
}

export const Base = Template.bind({})
