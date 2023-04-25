import QuestProgression from './quest-progression.vue'

export default {
  title: 'Proposals/Quest progression',
  component: QuestProgression,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuestProgression },
  template: `
    <quest-progression v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
