import DhoSwitcher from './dho-switcher.vue'

export default {
  title: 'Navigation/DHO Switcher',
  component: DhoSwitcher,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DhoSwitcher },
  template: `
    <dho-switcher v-bind="$props" />
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
