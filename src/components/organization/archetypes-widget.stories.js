import ArchetypesWidget from './archetypes-widget.vue'

export default {
  title: 'organization/Archetypes Widget',
  component: ArchetypesWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ArchetypesWidget },
  template: `
    <archetypes-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  archetypes: [
    {
      icon: 'far fa-lightbulb',
      title: 'Researching and Architecting'
    },
    {
      icon: 'far fa-lightbulb',
      title: 'Storytelling and Communicating'
    },
    {
      icon: 'far fa-lightbulb',
      title: 'Building and Developing'
    }
  ]
}

export const Base = Template.bind({})
