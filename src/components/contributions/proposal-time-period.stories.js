import ProposalTimePeriod from './proposal-time-period.vue'

export default {
  title: 'Contributions/Proposal Time Period',
  component: ProposalTimePeriod,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalTimePeriod },
  template: `
    <proposal-time-period v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
