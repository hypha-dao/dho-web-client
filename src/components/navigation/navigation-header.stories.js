import NavigationHeader from './navigation-header.vue'

export default {
  title: 'Navigation/Header',
  component: NavigationHeader,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NavigationHeader },
  template: `
    <navigation-header v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
