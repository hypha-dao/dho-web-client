import FilterWidget from './filter-widget.vue'

export default {
  title: 'Filters/Filter Widget',
  component: FilterWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FilterWidget },
  template: `
    <filter-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  view: '',
  textFilter: null,
  sort: 'Sort by last added',
  circle: 'All circles',
  optionArray: ['Sort by last added', 'Sort by something else'],
  circleArray: ['All circles', 'Circle One'],
  viewSelectorLabel: 'View',
  chipsFiltersLabel: 'Chips filters',
  filters: [
    {
      label: 'All',
      enabled: true,
      filter: () => true
    },
    {
      label: 'Contributions',
      enabled: true,
      filter: (p) => p.__typename === 'Payout'
    },
    {
      label: 'Assignments',
      enabled: true,
      filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
    },
    {
      label: 'Archetypes',
      enabled: true,
      filter: (p) => p.__typename === 'Role'
    },
    {
      label: 'Badges',
      enabled: true,
      filter: (p) => p.__typename === 'Assignbadge'
    },
    {
      label: 'Suspension',
      enabled: true,
      filter: (p) => p.__typename === 'Suspend'
    }
  ]
}

export const Base = Template.bind({})
