export function getProposalChipFilters () {
  return [
    {
      label: 'All',
      value: 'All',
      enabled: true,
      filter: () => true
    },
    {
      label: 'Generic Contributions',
      value: 'Payout',
      enabled: false,
      filter: (p) => p.__typename === 'Payout'
    },
    {
      label: 'Role Assignments',
      value: 'Assignment',
      enabled: false,
      filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
    },
    {
      label: 'Role Archetypes',
      value: 'Role',
      enabled: false,
      filter: (p) => p.__typename === 'Role'
    },
    {
      label: 'Badge Types',
      value: 'Badge',
      enabled: false,
      filter: (p) => p.__typename === 'Badge'
    },
    {
      label: 'Badge Assignments',
      value: 'Assignbadge',
      enabled: false,
      filter: (p) => p.__typename === 'Assignbadge'
    },
    {
      label: 'Suspension',
      value: 'Suspend',
      enabled: false,
      filter: (p) => p.__typename === 'Suspend'
    }
  ]
}
