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
  ],
  dho: {
    name: 'hypha',
    title: 'Hypha DHO',
    icon: 'hypha-logo.svg'
  },
  width: 80
}

export const Base = Template.bind({})
Base.args = {
  dhos: [],
  dho: {
    name: 'Lorem',
    title: 'lorem'
  },
  width: 100
}
