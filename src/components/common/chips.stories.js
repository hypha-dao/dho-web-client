import Chips from './chips.vue'

export default {
  title: 'Common/Chips',
  component: Chips,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Chips },
  template: `
    <chips v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  tags: [
    {
      label: 'Contribution',
      color: 'primary'
    },
    {
      label: 'Voting',
      color: 'secondary'
    }
  ]
}

export const Base = Template.bind({})
