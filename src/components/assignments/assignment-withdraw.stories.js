import AssignmentWithdraw from './assignment-withdraw.vue'

export default {
  title: 'Assignments/Withdraw',
  component: AssignmentWithdraw,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AssignmentWithdraw },
  template: `
    <assignment-withdraw v-bind="$props" />
  `
})

export const Base = Template.bind({})
