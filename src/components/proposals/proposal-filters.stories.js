import ProposalFilters from './proposal-filters.vue'

export default {
  title: 'Proposals/Filters',
  component: ProposalFilters,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalFilters },
  template: `
    <proposal-filters v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
