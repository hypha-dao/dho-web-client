import CirclesWidget from './circles-widget.vue'

export default {
  title: 'organization/Circles Widget',
  component: CirclesWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CirclesWidget },
  template: `
    <circles-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  circles: [
    {
      title: 'Anchor',
      description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
      icon: 'fas fa-anchor'
    },
    {
      title: 'Communication',
      description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
      icon: 'far fa-paper-plane'
    },
    {
      title: 'Financial',
      description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
      icon: 'fas fa-chart-line'
    },
    {
      title: 'Movement building',
      description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
      icon: 'fas fa-bullhorn'
    },
    {
      title: 'People',
      description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
      icon: 'fas fa-user-friends'
    },
    {
      title: 'Product',
      description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
      icon: 'fas fa-cube'
    }
  ]
}

export const Base = Template.bind({})
