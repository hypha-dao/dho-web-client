import DynamicCommit from './dynamic-commit.vue'

export default {
  title: 'Contributions/Dynamic Commit',
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
}

export const Base = Template.bind({})
