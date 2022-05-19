import CurrentBalance from './current-balance.vue'

export default {
  title: 'Profiles/CurrentBalance',
  component: CurrentBalance,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CurrentBalance },
  template: `
    <current-balance v-bind="$props" />
  `
})

export const Base = Template.bind({})
Base.args = { }

export const Example = Template.bind({})
Example.args = {
  tokens: [
    {
      name: 'HYPHA',
      amount: 3245
    },
    {
      name: 'HUSD',
      amount: '4400000'
    },
    {
      name: 'HVOICE',
      amount: '3300000000'
    }
  ]
}

export const Loading = Template.bind({})
Loading.args = {
  ...Example.args,
  loading: true
}
