import '../../css/app.styl'

import InputEditor from './input-editor.vue'

export default {
  title: 'Common/ Input Editor',
  component: InputEditor,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { InputEditor },
  template: `
    <input-editor v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {

}

export const Base = Template.bind({})
