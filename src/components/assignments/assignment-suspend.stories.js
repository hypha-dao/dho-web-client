import AssignmentSuspend from './assignment-suspend.vue'

export default {
  title: 'Assignments/Suspend',
  component: AssignmentSuspend,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AssignmentSuspend },
  template: `
    <assignment-suspend v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  owner: 'lukegravdent',
  title: 'Building and Develing B5'
}

export const Base = Template.bind({})
