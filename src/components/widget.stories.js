import Widget from './widget.vue'

export default {
  title: 'Base/Widget',
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

export const TitleBar = Template.bind({})
TitleBar.args = {
  bar: true,
  title: 'Widget'
}

export const ContentExample = Template.bind({})
ContentExample.args = {
  ...TitleBar.args,
  default: '<p>Lorem ipsum and other random crap</p>'
}

export const Base = Template.bind({})
