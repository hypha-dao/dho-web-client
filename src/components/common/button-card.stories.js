import ButtonCard from './button-card.vue'

export default {
  title: 'Common/Button Card',
  component: ButtonCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ButtonCard },
  template: `
    <button-card v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  color: 'primary',
  disable: false,
  outline: false,
  title: 'First Quarter',
  subtitle: 'Jun 15 - Jun 22',
  icon: 'fas fa-adjust',
  chip: {
    label: 'Current',
    color: 'white',
    text: 'primary',
    outline: false
  }
}

export const Base = Template.bind({})
