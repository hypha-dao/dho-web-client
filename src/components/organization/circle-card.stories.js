import CircleCard from './circle-card.vue'

export default {
  title: 'organization/Circles Card',
  component: CircleCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CircleCard },
  template: `
    <circle-card v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  title: 'Example Title',
  description: 'This is an circle example',
  icon: 'home'
}

export const Base = Template.bind({})
