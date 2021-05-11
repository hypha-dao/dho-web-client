import ProposalTags from './proposal-tags.vue'

export default {
  title: 'Contributions/Proposal Tags',
  component: ProposalTags,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalTags },
  template: `
    <proposal-tags v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  tags: [
    {
      label: 'Contribution',
      color: 'primary'
    },
    {
      label: 'Voting',
      color: 'secondary'
    }
  ]
}

export const Base = Template.bind({})
