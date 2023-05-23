export function getProposalChipFilters () {
  return [
    {
      label: 'All',
      value: 'All',
      enabled: true,
      filter: () => true
    },
    {
      label: 'Ability',
      value: 'Assignbadge',
      enabled: false,
      filter: (p) => p.__typename === 'Assignbadge'
    },
    {
      label: 'Role',
      value: 'Assignment',
      enabled: false,
      filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
    },
    {
      label: 'Quest Start',
      value: 'Queststart',
      enabled: false,
      filter: (p) => p.__typename === 'Queststart'
    },
    {
      label: 'Quest End',
      value: 'Questcomplet',
      enabled: false,
      filter: (p) => p.__typename === 'Questcomplet'
    },
    {
      label: 'Archetype',
      value: 'Role',
      enabled: false,
      filter: (p) => p.__typename === 'Role'
    },
    {
      label: 'Badge',
      value: 'Badge',
      enabled: false,
      filter: (p) => p.__typename === 'Badge'
    },
    {
      label: 'Circle',
      value: 'Circle',
      enabled: false,
      filter: (p) => p.__typename === 'Circle'
    },
    {
      label: 'Budget',
      value: 'Budget',
      enabled: false,
      filter: (p) => p.__typename === 'Budget'
    },
    {
      label: 'Policy',
      value: 'Policy',
      enabled: false,
      filter: (p) => p.__typename === 'Policy'
    },
    {
      label: 'Generic Contributions',
      value: 'Payout',
      enabled: false,
      filter: (p) => p.__typename === 'Payout'
    },
    {
      label: 'Suspension',
      value: 'Suspend',
      enabled: false,
      filter: (p) => p.__typename === 'Suspend'
    }
  ]
}
