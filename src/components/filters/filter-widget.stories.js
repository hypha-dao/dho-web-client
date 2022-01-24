import FilterWidget from './filter-widget.vue'

export default {
  title: 'Filters/Filter Widget',
  component: FilterWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FilterWidget },
  template: `
    <filter-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  name: 'Johnny Cage',
  size: '64px',
  username: 'johnnyhypha1'
}

export const Base = Template.bind({})
