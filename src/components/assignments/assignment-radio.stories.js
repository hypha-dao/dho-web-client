import AssignmentRadio from './assignment-radio.vue'

export default {
  title: 'Assignments/Radio',
  component: AssignmentRadio,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AssignmentRadio },
  template: `
    <assignment-radio v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  assignment: {
    __typename: 'Assignment',
    details_title_s: 'Hypha Frontend Dev',
    details_periodCount_i: 12,
    role: [
      {
        details_title_s: 'Building and Developing B4'
      }
    ]
  },
  selected: false
}
