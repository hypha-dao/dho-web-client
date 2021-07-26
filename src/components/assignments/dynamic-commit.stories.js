import DynamicCommit from './dynamic-commit.vue'

export default {
  title: 'Assignments/Dynamic Commit',
  component: DynamicCommit,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DynamicCommit },
  template: `
    <dynamic-commit v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  commit: {
    value: 80,
    min: 0,
    max: 100
  }
}

export const Base = Template.bind({})
