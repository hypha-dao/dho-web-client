import QuickActions from './quick-actions.vue'

export default {
  title: 'Navigation/Quick Actions',
  component: QuickActions,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuickActions },
  template: `
    <quick-actions v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
