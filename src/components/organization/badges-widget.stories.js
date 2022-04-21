import BadgesWidget from './badges-widget.vue'

export default {
  title: 'organization/Badges Widget',
  component: BadgesWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { BadgesWidget },
  template: `
    <badges-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  badges: [
    {
      title: 'Badge',
      description: 'Description',
      icon: 'icon',
      assignments: []
    },
    {
      title: 'Badge - 2',
      description: 'Description',
      icon: 'icon',
      assignments: []
    },
    {
      title: 'Badge - 3',
      description: 'Description',
      icon: 'icon',
      assignments: []
    }
  ]
}

export const Default = Template.bind({})
