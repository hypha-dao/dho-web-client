import SalaryFieldset from './salary-fieldset.vue'

export default {
  title: 'Contributions/Salary Fieldset',
  component: SalaryFieldset,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SalaryFieldset },
  template: `
    <salary-fieldset v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  tokens: [
    {
      label: 'HUSD',
      value: 1701.84
    },
    {
      label: 'HVOICE',
      value: 4862.42
    },
    {
      label: 'HYPHA',
      value: 94.81
    }
  ],
  commit: {
    min: 0,
    value: 80,
    max: 80
  },
  deferred: 30,
  usdEquivalent: 150000
}

export const Base = Template.bind({})
