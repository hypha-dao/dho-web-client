import AssignmentClaimExtend from './assignment-claim-extend.vue'

export default {
  title: 'Assignments/Claim Extend',
  component: AssignmentClaimExtend,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AssignmentClaimExtend },
  template: `
    <assignment-claim-extend v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
