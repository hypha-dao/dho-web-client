import ProgressPercentage from './progress-percentage.vue'

export default {
  title: 'Common/Progress Percentage',
  component: ProgressPercentage,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProgressPercentage },
  template: `
    <progress-percentage v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  icon: 'far fa-thumbs-up',
  title: 'Support',
  threshold: 0.80,
  value: 0.85
}

export const Negative = Template.bind({})
Negative.args = {
  icon: 'fas fa-users',
  title: 'Quorum',
  threshold: 0.20,
  value: 0.15
}

export const Base = Template.bind({})
