import '../../css/app.styl'

import LoadingSpinner from './loading-spinner.vue'

export default {
  title: 'Common/ Loading Spinner',
  component: LoadingSpinner,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LoadingSpinner },
  template: `
    <loading-spinner v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {

}

export const Base = Template.bind({})
