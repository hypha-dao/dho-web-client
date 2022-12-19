import DowngradePopUp from './downgrade-pop-up.vue'

export default {
  title: 'Plan/Downgrade Pop Up',
  component: DowngradePopUp,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DowngradePopUp },
  template: `
    <downgrade-pop-up v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  value: true
}

export const Base = Template.bind({})
