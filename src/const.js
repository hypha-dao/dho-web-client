export const PROPOSAL_TYPE = Object.freeze({
  ABILITY: 'Assignment Badge',
  ASSIGNBADGE: 'Assignbadge',
  ROLE: 'Assignment',
  QUEST_START: 'Queststart',
  QUEST_PAYOUT: 'Questcomplet',
  QUEST: 'Quest',

  ARCHETYPE: 'Role',
  BADGE: 'Badge',
  CIRCLE: 'Circle',
  POLICY: 'Policy',

  EDIT: 'Edit',
  PAYOUT: 'Payout',
  SUSPEND: 'Suspend',
  BUDGET: 'Budget',
  POLL: 'Poll'
})

export const ECOSYSTEM_DOMAIN = Object.freeze({
  SOCIO_ECOLOGICAL: 'SOCIO_ECOLOGICAL',
  SOCIO_ECONOMICAL: 'SOCIO_ECONOMICAL',
  SOCIO_POLITICAL: 'SOCIO_POLITICAL',
  SOCIO_PSYCHOLOGICAL: 'SOCIO_PSYCHOLOGICAL'
})

export const parseEcosystemDomain = (domain) => {
  switch (domain) {
    case ECOSYSTEM_DOMAIN.SOCIO_ECOLOGICAL:
      return 'Socio-Ecological'
    case ECOSYSTEM_DOMAIN.SOCIO_ECONOMICAL:
      return 'Socio-Economical'
    case ECOSYSTEM_DOMAIN.SOCIO_POLITICAL:
      return 'Socio-Political'
    case ECOSYSTEM_DOMAIN.SOCIO_PSYCHOLOGICAL:
      return 'Socio-Psychological'
  }
}

export const EXPLORE_BY = Object.freeze({
  DAOS: 'DAOS',
  ECOSYSTEMS: 'ECOSYSTEMS'
})

export const MEMBER_TYPE = Object.freeze({
  ALL: 'ALL',
  CORE: 'CORE',
  COMMUNITY: 'COMMUNITY'
})

export const PROPOSAL_STATE = Object.freeze({
  DRAFTED: 'drafted',
  PROPOSED: 'proposed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING: 'pending',
  ARCHIVED: 'archived',
  SUSPENDED: 'suspended',
  WITHDRAWED: 'withdrawed'
})

export const COLOR_TYPE = Object.freeze({
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  GREY: 'grey',
  WHITE: 'white'
})

export const VOTE_STATUS = Object.freeze({
  PASS: 'pass',
  ABSTAIN: 'abstain',
  FAIL: 'fail'
})

export const MULTISIG_TABS = Object.freeze({
  HISTORY: 'HISTORY',
  READY: 'READY',
  MULTISIG: 'MULTISIG',
  PAYOUT: 'PAYOUT'
})

export const RPC_ACCOUNTS = Object.freeze({
  EOSIO: 'eosio.msig'
})

export const PERIOD_NUMBERS = Object.freeze({
  SECS_PER_YEAR: 31557600,
  CYCLE_DURATION_SEC: 2629800
})

export const DEFAULT_TIER = 'Custom Reward'

export const MIN_TOKEN_MULTIPLIER = 0
export const MAX_TOKEN_MULTIPLIER = 1

export const ROUTE_NAMES = Object.freeze({
  CREATE_YOUR_DAO: 'create-your-dao',
  PROPOSAL_DETAIL: 'proposal-detail'
})
