import ButtonRadio from './button-radio.vue'

export default {
  title: 'Common/Button Radio',
  component: ButtonRadio,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ButtonRadio },
  template: `
    <button-radio v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  disable: false,
  title: 'One-time payment',
  description: 'Select this option for a single payment made once the proposal is approved',
  icon: 'fas fa-adjust'
}

export const Base = Template.bind({})
