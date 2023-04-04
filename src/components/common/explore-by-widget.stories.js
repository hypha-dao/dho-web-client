import ExploreByWidget from './explore-by-widget.vue'

export default {
  title: 'Explore By Widget',
  component: ExploreByWidget
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ExploreByWidget },
  template: `
    <explore-by-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {

}

export const Base = Template.bind({})
