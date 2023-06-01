import VersionHistory from './version-history.vue'

export default {
  title: 'Version History',
  component: VersionHistory,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VersionHistory },
  template: `
    <version-history v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {}
