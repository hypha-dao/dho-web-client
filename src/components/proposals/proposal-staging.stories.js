import ProposalStaging from './proposal-staging.vue'

export default {
  title: 'Proposals/Staging',
  component: ProposalStaging,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalStaging },
  template: `
    <proposal-staging v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
