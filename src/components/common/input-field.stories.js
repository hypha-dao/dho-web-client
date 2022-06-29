import '../../css/app.styl'

import InputField from './input-field.vue'

export default {
  title: 'Common/ Input Field',
  component: InputField,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { InputField },
  template: `
    <input-field v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {

}

export const Base = Template.bind({})
