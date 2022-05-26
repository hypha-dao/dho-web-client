import ProposalSuspended from './proposal-suspended.vue'

export default {
  title: 'Proposals/Suspended',
  component: ProposalSuspended,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalSuspended },
  template: `
    <proposal-suspended v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
