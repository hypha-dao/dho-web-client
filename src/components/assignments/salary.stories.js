import Salary from './salary.vue'

export default {
  title: 'Assignments/Salary',
  component: Salary,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Salary },
  template: `
    <salary v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  active: true,
  tokens: [
    {
      label: 'HUSD',
      value: 1701.84,
      icon: 'husd.svg'
    },
    {
      label: 'HVOICE',
      value: 4862.42,
      icon: 'hvoice.svg'
    },
    {
      label: 'HYPHA',
      value: 94.81,
      icon: 'hypha.svg',
      detail: '30% deferred'
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
