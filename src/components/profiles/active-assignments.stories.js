import ActiveAssignments from './active-assignments.vue'

export default {
  title: 'Profiles/Active Assignments',
  component: ActiveAssignments,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ActiveAssignments },
  template: `
    <active-assignments v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
