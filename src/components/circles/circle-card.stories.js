import CircleCard from './circle-card.vue'

export default {
  title: 'Circles/Circle Card',
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
  name: 'Product Circle',
  assignments: [
    {
      title: 'Frontend Dev',
      assignee: 'johnnyhypha1'
    }
  ],
  members: [
    {
      username: 'johnnyhypha1',
      name: 'Johnny Cage',
      avatar: 'avatar-placeholder.png'
    }
  ]
}

export const Base = Template.bind({})
