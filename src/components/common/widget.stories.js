import Widget from './widget.vue'

export default {
  title: 'Common/Widget',
  component: Widget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Widget },
  template: `
    <widget v-bind="$props">
      <template v-if="${args.default != null}" v-slot>${args.default}</template>
    </widget>
  `
})

export const Example = Template.bind({})
Example.args = {
  title: 'Widget',
  default: '<p>Lorem ipsum and other random crap</p>'
}

export const TitleBar = Template.bind({})
TitleBar.args = {
  ...Example.args,
  bar: true,
  more: true
}

export const Base = Template.bind({})
