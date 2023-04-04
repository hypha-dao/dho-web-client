import QuestClaimWidget from './quest-claim-widget.vue'

export default {
  title: 'Proposals/Quest claim widget',
  component: QuestClaimWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuestClaimWidget },
  template: `
    <quest-claim-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
