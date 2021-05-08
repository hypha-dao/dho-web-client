import EditDialog from './edit-dialog.vue'

export default {
  title: 'Profiles/Edit Dialog',
  component: EditDialog,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { EditDialog },
  template: `
    <edit-dialog v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
