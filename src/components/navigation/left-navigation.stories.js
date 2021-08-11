import LeftNavigation from './left-navigation.vue'

export default {
  title: 'Navigation/Left Navigation',
  component: LeftNavigation,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LeftNavigation },
  template: `
    <left-navigation v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  dhos: [
    {
      name: 'Hypha',
      img: 'app-logo-128x128.png'
    }
  ]
}

export const Base = Template.bind({})
