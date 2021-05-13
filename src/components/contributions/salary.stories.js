import Salary from './salary.vue'

export default {
  title: 'Contributions/Salary',
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
}

export const Base = Template.bind({})
