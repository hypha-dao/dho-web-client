import VotingOption5Scale from './voting-option-5-scale.vue'

export default {
  title: 'Proposals/Voting Option 5-Scale',
  component: VotingOption5Scale,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VotingOption5Scale },
  template: `
    <voting-option-5-scale v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
