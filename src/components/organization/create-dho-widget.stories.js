import CreateDhoWidget from './create-dho-widget.vue'

export default {
  title: 'organization/Create DHO Widget',
  component: CreateDhoWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CreateDhoWidget },
  template: `
    <create-dho-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
