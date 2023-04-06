export function getProposalChipFilters () {
  return [
    {
      label: 'All',
      enabled: true,
      filter: () => true
    },
    {
      label: 'Generic Contributions',
      enabled: false,
      filter: (p) => p.__typename === 'Payout'
    },
    {
      label: 'Role Assignments',
      enabled: false,
      filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
    },
    {
      label: 'Role Archetypes',
      enabled: false,
      filter: (p) => p.__typename === 'Role'
    },
    {
      label: 'Badge Types',
      enabled: false,
      filter: (p) => p.__typename === 'Badge'
    },
    {
      label: 'Badge Assignments',
      enabled: false,
      filter: (p) => p.__typename === 'Assignbadge'
    },
    {
      label: 'Suspension',
      enabled: false,
      filter: (p) => p.__typename === 'Suspend'
    }
  ]
}
