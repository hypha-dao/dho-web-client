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
  unity: 0.85,
  quorum: 0.15,
  expired: false,
  colorConfig: undefined,
  colorConfigQuorum: undefined,
  mini: true
}

export const Base = Template.bind({})
Base.args = {
  unity: 0.85,
  quorum: 0.15,
  expired: false,
  colorConfig: undefined,
  colorConfigQuorum: undefined,
  mini: true
}

export const BaseWithConfig = Template.bind({})
BaseWithConfig.args = {
  unity: 0.85,
  quorum: 0.15,
  expired: false,
  colorConfig: {
    text: { 'text-primary': true },
    progress: 'primary',
    icons: 'primary'
  },
  colorConfigQuorum: {
    text: { 'text-negative': true },
    progress: 'negative',
    icons: 'negative'
  },
  mini: true
}
