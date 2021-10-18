import ProposalCard from './proposal-card.vue'

export default {
  title: 'Proposals/Card',
  component: ProposalCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalCard },
  template: `
    <proposal-card v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  hash: String,
  type: 'Assignment',
  title: 'Hypha Frontend Dev',
  subtitle: 'Building and Developing B4',
  proposer: 'lukegravdent',
  vote: 'pass',
  voting: {
    quorum: 0.15,
    unity: 0.92
  },
  expiration: '2 days left',
  view: 'list'
}

export const Base = Template.bind({})
