import VotingResult from './voting-result.vue'

export default {
  title: 'Proposals/Voting Result',
  component: VotingResult,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VotingResult },
  template: `
    <voting-result v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  approval: 0.85,
  quorum: 0.15
}

export const Base = Template.bind({})
