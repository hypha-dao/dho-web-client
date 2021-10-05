import SupportWidget from './support-widget.vue'

export default {
  title: 'dashboard/Support Widget',
  component: SupportWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SupportWidget },
  template: `
    <support-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
