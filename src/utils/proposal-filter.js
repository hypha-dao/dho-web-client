import I18n from './i18n'
export function getProposalChipFilters () {
  return [
    {
      label: I18n.t('proposalFilter.all'),
      value: 'All',
      enabled: true,
      filter: () => true
    },
    {
      label: I18n.t('proposalFilter.ability'),
      value: 'Assignbadge',
      enabled: false,
      filter: (p) => p.__typename === 'Assignbadge'
    },
    {
      label: I18n.t('proposalFilter.role'),
      value: 'Assignment',
      enabled: false,
      filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
    },
    {
      label: I18n.t('proposalFilter.queststart'),
      value: 'Queststart',
      enabled: false,
      filter: (p) => p.__typename === 'Queststart'
    },
    {
      label: I18n.t('proposalFilter.questend'),
      value: 'Questcomplet',
      enabled: false,
      filter: (p) => p.__typename === 'Questcomplet'
    },
    {
      label: I18n.t('proposalFilter.archetype'),
      value: 'Role',
      enabled: false,
      filter: (p) => p.__typename === 'Role'
    },
    {
      label: I18n.t('proposalFilter.badge'),
      value: 'Badge',
      enabled: false,
      filter: (p) => p.__typename === 'Badge'
    },
    {
      label: I18n.t('proposalFilter.circle'),
      value: 'Circle',
      enabled: false,
      filter: (p) => p.__typename === 'Circle'
    },
    {
      label: I18n.t('proposalFilter.budget'),
      value: 'Budget',
      enabled: false,
      filter: (p) => p.__typename === 'Budget'
    },
    {
      label: I18n.t('proposalFilter.policy'),
      value: 'Policy',
      enabled: false,
      filter: (p) => p.__typename === 'Policy'
    },
    {
      label: I18n.t('proposalFilter.genericcontributions'),
      value: 'Payout',
      enabled: false,
      filter: (p) => p.__typename === 'Payout'
    },
    {
      label: I18n.t('proposalFilter.suspension'),
      value: 'Suspend',
      enabled: false,
      filter: (p) => p.__typename === 'Suspend'
    }
  ]
}
