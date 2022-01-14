import ProposalDraft from './proposal-draft.vue'

export default {
  title: 'Proposals/Draft',
  component: ProposalDraft,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalDraft },
  template: `
    <proposal-draft v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  category: 'Bridge',
  title: 'Bridge Expense - From 12/25/2441 to 12/25/2552',
  lastEditted: new Date()
}
