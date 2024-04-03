/* eslint-disable no-unreachable */
import HyphaTokensSaleUtil from '@hypha-dao/hypha-token-sales-util'
import { JsonRpc } from 'eosjs'
import { RPC_ACCOUNTS } from '~/const'

import camelToSnakeCase from '~/utils/camelToSnakeCase'
import generateRandomString from '~/utils/generateRandomString'
import generateSecret from '~/utils/generateSecret'
import ipfsy from '~/utils/ipfsy'

export const createDAO = async function (context, { data, isDraft }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: isDraft ? 'createdaodft' : 'createdao',
    data: {
      config: [
      // GROUP: details
        [
          { label: 'content_group_label', value: ['string', 'details'] },
          { label: 'dao_name', value: ['name', data?.name] },
          { label: 'dao_title', value: ['string', data?.title] },
          { label: 'dao_description', value: ['string', data?.description] },

          { label: 'is_template', value: ['int64', 0] },
          { label: 'dao_template', value: ['int64', data?.template] },

          //
          { label: 'voice_token_decay_period', value: ['int64', 604800] },
          { label: 'voice_token_decay_per_period_x10M', value: ['int64', 100000] },

          { label: 'voice_token', value: ['asset', `${parseFloat(1).toFixed(data?.voiceDigits)} ${data?.voiceSymbol}`] },
          { label: 'use_seeds', value: ['int64', data?.use_seeds ? 1 : 0] },

          { label: 'voting_duration_sec', value: ['int64', data?.votingDurationSec] },
          { label: 'period_duration_sec', value: ['int64', data?.periodDurationSec] },
          { label: 'voting_alignment_x100', value: ['int64', data?.votingAlignmentPercent] },
          { label: 'voting_quorum_x100', value: ['int64', data?.votingQuorumPercent] },

          { label: 'voice_token_decay_period', value: ['int64', 604800] },
          { label: 'voice_token_decay_per_period_x10M', value: ['int64', 100000] },

          { label: 'utility_token_multiplier', value: ['int64', data?.utilityTokenMultiplier] },
          { label: 'voice_token_multiplier', value: ['int64', data?.voiceTokenMultiplier] },
          { label: 'treasury_token_multiplier', value: ['int64', data?.treasuryTokenMultiplier] },

          { label: 'onboarder_account', value: ['name', data?.onboarder_account] },

          ...(data?.parentId ? [{ label: 'dao_parent', value: ['int64', data?.parentId] }] : [])

        ],

        // GROUP: core members
        [
          { label: 'content_group_label', value: ['string', 'core_members'] }
          // EXAMPLE: { label: 'account', value: ['name', data?.name] }
          // ...data?.members.map(member => ({ label: 'account', value: ['name', member?.account] }))
        ],

        // GROUP: salary bands
        // [
        // { label: 'content_group_label', value: ['string', 'salary_bands'] }
        // EXAMPLE: { "label": "Band 1", "value": ["asset", "70000.00 USD"] },
        // ...data.salaries.map(salary => ({ label: salary?.name, value: ['asset', `${parseFloat(salary?.value).toFixed(2)} USD`] }))
        // ],

        // GROUP: design style
        [
          { label: 'content_group_label', value: ['string', 'style'] },
          { label: 'logo', value: ['string', data?.logo] },
          { label: 'primary_color', value: ['string', data?.primaryColor] },
          { label: 'secondary_color', value: ['string', data?.secondaryColor] },
          { label: 'text_color', value: ['string', data?.textColor] }
        ]
      ]
    }
  }]
  if (data?.daoUrl) {
    actions[0].data.config[0].push(
      { label: 'dao_url', value: ['string', data?.daoUrl] }
    )
  }
  if (data.skipTokens) {
    actions[0].data.config[0].push(
      { label: 'skip_peg_token_create', value: ['int64', 1] },
      { label: 'skip_reward_token_create', value: ['int64', 1] }
    )
  } else {
    actions[0].data.config[0].push(
      { label: 'reward_token_name', value: ['string', data?.utilityName] },
      { label: 'reward_token', value: ['asset', `${parseFloat(1).toFixed(data?.utilityDigits)} ${data?.utilitySymbol}`] },
      { label: 'reward_token_max_supply', value: ['asset', `${parseFloat(-1).toFixed(data?.utilityDigits)} ${data?.utilitySymbol}`] },
      { label: 'reward_to_peg_ratio', value: ['asset', `${parseFloat(1).toFixed(data?.treasuryDigits)} ${data?.treasurySymbol}`] },
      { label: 'peg_token_name', value: ['string', data?.treasuryName] },
      { label: 'peg_token', value: ['asset', `${parseFloat(1).toFixed(data?.treasuryDigits)} ${data?.treasurySymbol}`] }
    )
  }
  return this.$api.signTransaction(actions)
}

export const updateDAOSettings = async function ({ state, rootState }, { data, alerts, announcements }) {
  // const UPVOTE = 'UPVOTE'

  // const daoSettings = this.getters['dao/daoSettings']
  // const upvoteRounds = JSON.parse(data.upvoteRounds)
  // const upvoteData = {
  //   election_config: [
  //     [
  //       { label: 'content_group_label', value: ['string', 'details'] },
  //       { label: 'upvote_start_date_time', value: ['time_point', data?.upvoteStartDateTime] },
  //       { label: 'upvote_duration', value: ['int64', data?.upvoteDuration] }
  //     ],
  //     ...upvoteRounds.map((_, index) => [
  //       { label: 'content_group_label', value: ['string', 'round'] },
  //       { label: 'duration', value: ['int64', _.duration] },
  //       { label: 'type', value: ['string', 'delegate'] },
  //       { label: 'round_id', value: ['int64', index] },
  //       { label: 'passing_count', value: ['int64', _.peoplePassing] }
  //     ]),
  //     [
  //       { label: 'content_group_label', value: ['string', 'round'] },
  //       { label: 'duration', value: ['int64', data?.upvoteCheifDelegateDuration] },
  //       { label: 'type', value: ['string', 'chief'] },
  //       { label: 'round_id', value: ['int64', upvoteRounds.length + 1] },
  //       { label: 'passing_count', value: ['int64', data?.upvoteCheifDelegateCount] }
  //     ],
  //     [
  //       { label: 'content_group_label', value: ['string', 'round'] },
  //       { label: 'duration', value: ['int64', data?.upvoteHeadDelegateDuration] },
  //       { label: 'type', value: ['string', 'head'] },
  //       { label: 'round_id', value: ['int64', upvoteRounds.length + 2] },
  //       { label: 'passing_count', value: ['int64', 1] }
  //     ]
  //   ]
  // }

  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'setdaosetting',
      data: {
        dao_id: rootState.dao.docId,
        kvs: Object.keys(data).map(key => {
          const valueTypes = {
            // _s for string
            // _i for int64
            // _n for name
            // _t for time_point
            // _a for asset

            number: 'int64',
            string: 'string'
          }

          const value = data[key]
          const type = valueTypes[typeof value]

          return {
            key: camelToSnakeCase(key),
            value: [type, value]
          }
        })
      }
    }
    // ...(alerts.created.length > 0
    //   ? [{
    //       account: this.$config.contracts.dao,
    //       name: 'modalerts',
    //       data: {
    //         root_id: 0,
    //         alerts: [[
    //           { label: 'content_group_label', value: ['string', 'add'] },
    //           ...alerts.created.map(alert => (
    //             { label: 'alert', value: ['string', `${alert.level};${alert.content};${alert.enabled ? 1 : 0}`] }
    //           ))
    //         ]]
    //       }
    //     }]
    //   : []),
    // ...(alerts.updated.length > 0
    //   ? [{
    //       account: this.$config.contracts.dao,
    //       name: 'modalerts',
    //       data: {
    //         root_id: 0,
    //         alerts: [[
    //           { label: 'content_group_label', value: ['string', 'edit'] },
    //           ...alerts.updated.map(alert => (
    //             { label: 'alert', value: ['string', `${alert.id};${alert.level};${alert.content};${alert.enabled ? 1 : 0};`] }
    //           ))
    //         ]]
    //       }
    //     }]
    //   : []),
    // ...(alerts.deleted.length > 0
    //   ? [{
    //       account: this.$config.contracts.dao,
    //       name: 'modalerts',
    //       data: {
    //         root_id: 0,
    //         alerts: [[
    //           { label: 'content_group_label', value: ['string', 'del'] },
    //           ...alerts.deleted.map(alert => (
    //             { label: 'alert', value: ['int64', Number(alert.id)] }
    //           ))
    //         ]]
    //       }
    //     }]
    //   : []),

    // ...(announcements?.created.length > 0
    //   ? [{
    //       account: this.$config.contracts.dao,
    //       name: 'modalerts',
    //       data: {
    //         root_id: docId,
    //         alerts: [[
    //           { label: 'content_group_label', value: ['string', 'add'] },
    //           ...announcements.created.map(announcement => (
    //             // For add: level;content;enabled
    //             { label: 'alert', value: ['string', `${announcement.title};${announcement.message};${announcement.enabled ? 1 : 0}`] }
    //           ))
    //         ]]
    //       }
    //     }]
    //   : []),
    // ...(announcements?.updated.length > 0
    //   ? [{
    //       account: this.$config.contracts.dao,
    //       name: 'modalerts',
    //       data: {
    //         root_id: docId,
    //         alerts: [[
    //           { label: 'content_group_label', value: ['string', 'edit'] },
    //           ...announcements.updated.map(announcement => (
    //             // For edit: id;level;content;enabled
    //             { label: 'alert', value: ['string', `${announcement.id};${announcement.title};${announcement.message};${announcement.enabled ? 1 : 0}`] }
    //           ))
    //         ]]
    //       }
    //     }]
    //   : []),
    // ...(announcements?.deleted.length > 0
    //   ? [{
    //       account: this.$config.contracts.dao,
    //       name: 'modalerts',
    //       data: {
    //         root_id: docId,
    //         alerts: [[
    //           { label: 'content_group_label', value: ['string', 'del'] },
    //           ...announcements.deleted.map(announcement => (
    //             { label: 'alert', value: ['int64', Number(announcement.id)] }
    //           ))
    //         ]]
    //       }
    //     }]
    //   : []),

    // ...(data.communityVotingMethod === UPVOTE && daoSettings?.upvoteElectionId
    //   ? daoSettings?.upvoteElectionId
    //     ? [
    //         {
    //           account: this.$config.contracts.dao,
    //           name: 'createupvelc',
    //           data: {
    //             dao_id: docId,
    //             ...upvoteData
    //           }
    //         }
    //       ]
    //     : [
    //         {
    //           account: this.$config.contracts.dao,
    //           name: 'editupvelc',
    //           data: {
    //             election_id: daoSettings.upvoteElectionId,
    //             ...upvoteData
    //           }
    //         }
    //       ]
    //   : []
    // )

  ]

  return this.$api.signTransaction(actions)
}

export const getTreasuryOptions = async function (context, data) { // TODO: add getting ready to execute requests
  const rpc = new JsonRpc(this.$apiUrl)
  const account = await rpc.get_account(data.treasuryAccount)
  const auth = account.permissions.find(x => x.perm_name === 'active').required_auth
  const treshold = auth.threshold
  const signers = auth.accounts.filter(perm => perm.permission.permission === 'active')
  const signerWeightsMap = {}
  for (const signer of signers) {
    signerWeightsMap[signer.permission.actor] = signer.weight
  }
  return { treshold, signerWeightsMap }
}
export const createMultisigPay = async function (context, data) {
  const payments = data.payments.map(payment => {
    return {
      amount: payment.amountRequested,
      receiver: payment.requestor,
      notes: '',
      redemption_id: payment.redemption_id
    }
  })
  const rpc = new JsonRpc(this.$apiUrl)
  let signers = (await rpc.get_account(data.treasuryAccount))
  signers = signers.permissions.find(x => x.perm_name === 'active').required_auth.accounts
  signers = signers.filter(perm => perm.permission.permission === 'active')
  signers = signers.map(s => s.permission).filter(s => s.permission === 'active')
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'newmsigpay',
      authorization: [{
        actor: context.rootState.accounts.account,
        permission: 'active'
      }],
      data: {
        treasury_id: data.treasuryId,
        treasurer: context.rootState.accounts.account,
        payments: payments,
        signers: signers
      }
    }
  ]
  return this.$api.signTransaction(actions)
}
export const approveMultisigPay = function (context, { data }) {
  const actions = [
    {
      account: RPC_ACCOUNTS.EOSIO,
      name: 'approve',
      authorization: [{
        actor: context.rootState.accounts.account,
        permission: 'active'
      }],
      data: {
        proposer: this.$config.contracts.dao,
        proposal_name: data?.[0].proposalName,
        level: {
          actor: context.rootState.accounts.account,
          permission: 'active'
        }
      }
    },
    {
      account: this.$config.contracts.dao,
      name: 'updatemsig',
      authorization: [{
        actor: context.rootState.accounts.account,
        permission: 'active'
      }],
      data: {
        msig_id: data?.[0].msigId
      }
    }
  ]
  return this.$api.signTransaction(actions)
}
export const executeMultisigPay = function (context, { data }) {
  const actions = [
    {
      account: RPC_ACCOUNTS.EOSIO,
      name: 'exec',
      authorization: [{
        actor: context.rootState.accounts.account,
        permission: 'active'
      }],
      data: {
        proposer: this.$config.contracts.dao,
        proposal_name: data?.[0].proposalName,
        executer: context.rootState.accounts.account
      }
    }
  ]
  return this.$api.signTransaction(actions)
}
export const createSettingsMultisig = async function ({ state, rootState }, { docId, data }) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'createmsig',
      data: {
        creator: context.rootState.accounts.account,
        dao_id: rootState.dao.docId,
        kvs: Object.keys(data).map(key => {
          const valueTypes = {
            // _s for string
            // _i for int64
            // _n for name
            // _t for time_point
            // _a for asset

            number: 'int64',
            string: 'string'
          }

          const value = data[key]
          const type = valueTypes[typeof value]

          return {
            key: camelToSnakeCase(key),
            value: [type, value]
          }
        })
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const cancelSettingsMultisig = async function (context, { id }) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'cancelcmsig',
      data: {
        msig_id: id,
        canceler: context.rootState.accounts.account
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const voteSettingsMultisig = async function (context, { id, approve }) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'votemsig',
      data: {
        msig_id: id,
        signer: context.rootState.accounts.account,
        approve
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const executeSettingsMultisig = async function (context, { id }) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'execmsig',
      data: {
        msig_id: id,
        executer: context.rootState.accounts.account
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const addAdmins = async function (context, { daoId, users }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'addadmins',
    data: {
      dao_id: daoId,
      admin_accounts: users
    }
  }]

  return this.$api.signTransaction(actions)
}

export const activateDAOPlan = async function (context, data) {
  const actions = [
    {
      account: this.$config.contracts.hypha,
      name: 'transfer',
      data: {
        from: data.account,
        to: this.$config.contracts.dao,
        quantity: data.quantity,
        memo: `credit;${data.daoId}`
      }
    },
    {
      account: this.$config.contracts.dao,
      name: 'activateplan',
      data: {
        plan_info: [[
          { label: 'content_group_label', value: ['string', 'details'] },
          { label: 'dao_id', value: ['int64', data.daoId] },
          { label: 'plan_id', value: ['int64', data.planId] },
          { label: 'offer_id', value: ['int64', data.offerId] },
          { label: 'periods', value: ['int64', data.periods] }
        ]]
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const downgradeDAOPlan = async function (context, daoId) {
  const response = await this.$apollo.query({
    query: require('~/query/_pages/plan-page-query.gql'),
    variables: { daoId }
  })

  const freePlan = response.data.plans.find(_ => _.name === 'Founders')
  const monthOffer = response.data.offers.find(_ => _.name === '1 month')

  const data = {
    daoId,
    planId: freePlan.id,
    offerId: monthOffer.id,
    periods: 1
  }

  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'activateplan',
      data: {
        plan_info: [[
          { label: 'content_group_label', value: ['string', 'details'] },
          { label: 'dao_id', value: ['int64', data.daoId] },
          { label: 'plan_id', value: ['int64', data.planId] },
          { label: 'offer_id', value: ['int64', data.offerId] },
          { label: 'periods', value: ['int64', data.periods] }
        ]]
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const convertToEcosystem = async function (context, daoId) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'markasecosys',
      data: {
        dao_id: daoId
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const importEdenElection = async function (context, daoId) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'importelct',
    data: {
      dao_id: daoId,
      deferred: 0
    }
  }]

  return this.$api.signTransaction(actions)
}

export const activateEcosystem = async function (context, data) {
  const actions = [
    {
      account: this.$config.contracts.hypha,
      name: 'transfer',
      data: {
        from: data.account,
        to: this.$config.contracts.dao,
        quantity: data.quantity,
        memo: `credit;${data.daoId}`
      }
    },
    {
      account: this.$config.contracts.dao,
      name: 'activateecos',
      data: {
        ecosystem_info: [[
          { label: 'content_group_label', value: ['string', 'details'] },
          { label: 'dao_id', value: ['int64', data.daoId] },
          { label: 'beneficiary', value: ['name', data.account] }
        ]]
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const activateChildDao = async function (context, data) {
  const actions = [
    {
      account: this.$config.contracts.hypha,
      name: 'transfer',
      data: {
        from: data.account,
        to: this.$config.contracts.dao,
        quantity: data.quantity,
        memo: `credit;${data.parentId}`
      }
    },
    {
      account: this.$config.contracts.dao,
      name: 'createdao',
      data: {
        config: [[
          { label: 'content_group_label', value: ['string', 'details'] },
          { label: 'dao_draft', value: ['int64', data?.daoId] },
          { label: 'dao_parent', value: ['int64', data?.parentId] },
          { label: 'dao_name', value: ['name', data?.daoName] },
          { label: 'beneficiary', value: ['name', data.account] }
        ]]
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const updateEcosystemSettings = async function (context, { docId, data }) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'setdaosetting',
      data: {
        dao_id: docId,
        group: 'ecosystem',
        kvs: [
          { key: 'name', value: ['string', data?.name] },
          { key: 'logo', value: ['string', data?.logo] },
          { key: 'domain', value: ['string', data?.domain] },
          { key: 'purpose', value: ['string', data?.purpose] }
        ]
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const isTokenAvailable = async function (context, token) {
  try {
    const dho = this.getters['dao/dho']
    const pegContract = dho.settings_pegTokenContract_n
    const { rows } = await this.$api.getTableRows({
      code: pegContract,
      scope: token,
      table: 'stat',
      limit: 500,
      reverse: false,
      show_payer: false
    })
    return rows.length === 0
  } catch (error) {
  }
}

export const createNotifications = async function (context, { docId, data }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'modalerts',
    data: {
      root_id: docId, /* DAO id or DHO */
      alerts: [[
        { label: 'content_group_label', value: ['string', 'add'] },
        ...data.map(notification => (
          { label: 'alert', value: ['string', `${notification.content};${notification.level};${notification.enabled ? 1 : 0}`] }
        ))
      ]]
    }
  }]

  return this.$api.signTransaction(actions)
}

export const updateNotifications = async function (context, { docId, data }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'modalerts',
    data: {
      root_id: docId, /* DAO id or DHO */
      alerts: [[
        { label: 'content_group_label', value: ['string', 'edit'] },
        ...data.map(notification => (
          { label: 'alert', value: ['string', `${notification.content};${notification.level};${notification.enabled ? 1 : 0}`] }
        ))
      ]]
    }
  }]

  return this.$api.signTransaction(actions)
}

export const deleteNotifications = async function (context, { docId, data }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'modalerts',
    data: {
      root_id: docId, /* DAO id or DHO */
      alerts: [[
        { label: 'content_group_label', value: ['string', 'del'] },
        ...data.map(notification => (
          { label: 'alert', value: ['int64_t', Number(notification.id)] }
        ))
      ]]
    }
  }]

  return this.$api.signTransaction(actions)
}

export const setTheme = async function ({ commit, state, dispatch }) {
  const theme = {
    primaryColor: state.settings?.primaryColor,
    secondaryColor: state.settings?.secondaryColor,
    textColor: state.settings?.textColor,
    pattern: state.settings?.pattern,
    patternColor: state.settings?.patternColor,
    patternOpacity: state.settings?.patternOpacity
  }

  // --q-color-primary: #242f5d;
  // --q-color-secondary: #3f64ee;
  // --q-color-accent: #5bd4ca;
  // --q-color-positive: #16b59b;
  // --q-color-negative: #ef3f69;
  // --q-color-info: #f99f17;
  // --q-color-warning: #ffbf40;
  // --q-color-dark: #1d1d1d;

  document.body.style.setProperty('--q-color-primary', theme.primaryColor)
  document.body.style.setProperty('--q-color-secondary', theme.secondaryColor)
}

export const initConfigs = async function ({ commit, state, dispatch }) {
  const getUSDPerHypha = async () => {
    const hyphaTokensSaleUtil = new HyphaTokensSaleUtil(process.env.HYPHA_TOKEN_SALES_RPC_URL, process.env.HYPHA_TOKEN_SALES_API_URL)
    const res = await hyphaTokensSaleUtil.init()
    return res.usdPerHypha
  }

  const [usdPerHypha] = await Promise.all([
    getUSDPerHypha()
  ])

  commit('setConfigs', { usdPerHypha })
}

export const applyForCircle = async function (context, { applicant, circleId }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'applycircle',
    data: {
      applicant,
      circle_id: circleId
    }
  }]

  return this.$api.signTransaction(actions)
}

export const enrollInCircle = async function (context, { applicant, circleId, enroller }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'enrollcircle',
    data: {
      applicant,
      circle_id: circleId,
      enroller
    }
  }]

  return this.$api.signTransaction(actions)
}

export const rejectInCircle = async function (context, { applicant, circleId, enroller }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'rejectcircle',
    data: {
      applicant,
      circle_id: circleId,
      enroller
    }
  }]

  return this.$api.signTransaction(actions)
}

export const initDAOTemplate = async function ({ state, rootState }, { proposals, settings }) {
  const actions = [
    ...proposals.map(_ => ({
      account: this.$config.contracts.dao,
      name: 'propose',
      data: {
        dao_id: rootState.dao.docId,
        proposer: rootState.accounts.account,
        proposal_type: _.type,
        content_groups: [[
          { label: 'content_group_label', value: ['string', 'details'] },
          { label: 'name', value: ['string', ''] },
          { label: 'title', value: ['string', _.title] },
          { label: 'description', value: ['string', _.description] },

          ...(_.type === 'role'
            ? [
                { label: 'annual_usd_salary', value: ['asset', `${parseFloat(1).toFixed(2)} USD`] },
                { label: 'fulltime_capacity_x100', value: ['int64', Math.round(parseFloat(1) * 100)] },
                { label: 'min_deferred_x100', value: ['int64', Math.round(parseFloat(1))] }
              ]
            : []),
          ...(_.type === 'circle' ? [{ label: 'purpose', value: ['string', ''] }] : []),

          ...(_.type === 'badge'
            ? [
                { label: 'icon', value: ['string', _.icon] },
                { label: 'voice_coefficient_x10000', value: ['int64', parseFloat(7000)] },
                { label: 'reward_coefficient_x10000', value: ['int64', parseFloat(7000)] },
                { label: 'peg_coefficient_x10000', value: ['int64', parseFloat(7000)] },
                { label: 'purpose', value: ['string', ''] }
              ]
            : [])

        ]],
        publish: true
      }
    }))

    // {
    //   account: this.$config.contracts.dao,
    //   name: 'setdaosetting',
    //   data: {
    //     dao_id: rootState.dao.docId,
    //     kvs: Object.keys(settings).map(key => {
    //       const valueTypes = {
    //         // _s for string
    //         // _i for int64
    //         // _n for name
    //         // _t for time_point
    //         // _a for asset

    //         number: 'int64',
    //         string: 'string'
    //       }

    //       const value = settings[key]
    //       const type = valueTypes[typeof value]

    //       return {
    //         key: camelToSnakeCase(key),
    //         value: [type, value]
    //       }
    //     })
    //   }
    // }

  ]

  return this.$api.signTransaction(actions)
}

export const createLevel = async function ({ state, rootState }, { data }) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'modsalaryband',
      data: {
        dao_id: rootState.dao.docId,
        salary_bands: [
          ...data.map(level =>
            [
              { label: 'content_group_label', value: ['string', 'add'] },
              { label: 'band', value: ['string', `${level.name};${parseFloat(level.annualAmount).toFixed(2)} USD;${level.minDeferred}`] }
            ]
          )
        ]
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const updateLevel = async function ({ state, rootState }, { data }) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'modsalaryband',
      data: {
        dao_id: rootState.dao.docId,
        salary_bands: [
          ...data.map(level =>
            [
              { label: 'content_group_label', value: ['string', 'edit'] },
              { label: 'band', value: ['string', `${level.id};${level.name};${parseFloat(level.annualAmount).toFixed(2)} USD;${level.minDeferred}`] }
            ]
          )
        ]
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const deleteLevel = async function ({ state, rootState }, { data }) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'modsalaryband',
      data: {
        dao_id: rootState.dao.docId,
        salary_bands: [
          ...data.map(level =>
            [
              { label: 'content_group_label', value: ['string', 'del'] },
              { label: 'band', value: ['int64', level.id] }
            ]
          )
        ]
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const createRole = async function ({ state, rootState }, { data }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propose',
    data: {
      dao_id: rootState.dao.docId,
      proposer: rootState.accounts.account,
      proposal_type: 'role',
      content_groups: [[
        { label: 'content_group_label', value: ['string', 'details'] },
        { label: 'auto_approve', value: ['int64', 1] },
        { label: 'title', value: ['string', data.name] },
        { label: 'description', value: ['string', data.description] },
        { label: 'url', value: ['string', ''] }
        // { label: 'annual_usd_salary', value: ['asset', `${parseFloat(draft.annualUsdSalary).toFixed(2)} USD`] },
        // { label: 'fulltime_capacity_x100', value: ['int64', Math.round(parseFloat(draft.roleCapacity) * 100)] },
        // { label: 'min_deferred_x100', value: ['int64', Math.round(parseFloat(draft.minDeferred))] }
      ]],
      publish: true
    }
  }]

  return this.$api.signTransaction(actions)
}

export const deleteRole = async function ({ state, rootState }, id) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'delasset',
      data: {
        dao_id: rootState.dao.docId,
        asset_id: id
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const createCircle = async function ({ state, rootState }, { data }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propose',
    data: {
      dao_id: rootState.dao.docId,
      proposer: rootState.accounts.account,
      proposal_type: 'circle',
      content_groups: [[
        { label: 'content_group_label', value: ['string', 'details'] },
        { label: 'auto_approve', value: ['int64', 1] },
        { label: 'title', value: ['string', data.name] },
        { label: 'description', value: ['string', data.description] },
        { label: 'name', value: ['string', ''] },
        { label: 'purpose', value: ['string', ''] },
        ...(data.circle ? [{ label: 'parent_circle', value: ['int64', data.circle] }] : [])
      ]],
      publish: true
    }
  }]

  return this.$api.signTransaction(actions)
}

export const deleteCircle = async function ({ state, rootState }, id) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'delasset',
      data: {
        dao_id: rootState.dao.docId,
        asset_id: id
      }
    }
  ]

  return this.$api.signTransaction(actions)
}

export const createInviteLink = async function ({ state, rootState }, id) {
  const CHAIN = process.env.CAPTCHA_NETWORK // telos | telosTestnet | eos | eosTestnet
  const DAO_ID = rootState.dao.docId
  const INVITE_CODE = generateRandomString(10)
  const ENROLL_SECRET = await generateSecret()

  const PAYLOAD = `https://hypha.earth/invite?code=${INVITE_CODE}&chain=${CHAIN}&dao=${DAO_ID}&enroll_secret=${ENROLL_SECRET.secret}`
  const url = `https://hyphawallet.page.link/?link=${encodeURIComponent(PAYLOAD)}&apn=earth.hypha.wallet.hypha_wallet&isi=1659926348&ibi=earth.hypha.wallet.hyphaWallet&cid=866980350130875998&_osl=https://hyphawallet.page.link/KPo2&_icp=1`
  const inviter = rootState.profiles.profiles[rootState.accounts.account].publicData

  const actions = [
    {
      account: this.$config.contracts.join,
      name: 'createinvite',
      data: {
        dao_id: rootState.dao.docId,
        dao_name: rootState.dao.settings.settings_daoName_n,
        dao_fullname: rootState.dao.settings.settings_daoTitle_s,
        inviter: rootState.accounts.account,
        hashed_secret: ENROLL_SECRET.hashedSecret
      }
    }
  ]
  await this.$api.signTransaction(actions)

  return {
    url,
    daoName: rootState.dao.settings.title,
    daoDescription: rootState.dao.settings.description,
    daoLogo: ipfsy(rootState.dao.settings.logo),
    coreMemberCount: rootState.dao.meta.memberCount,
    communityMemberCount: 0,
    inviterName: inviter.name,
    inviterAvatar: '' // TODO: Return once we have url shorten inviter.avatar
  }
}

export const createTokens = async function ({ state, rootState }, data) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'createtokens',
      data: {
        dao_id: rootState.dao.docId,
        tokens_info: [
          // payout token
          [
            { label: 'content_group_label', value: ['string', 'peg_details'] },
            { label: 'peg_token_name', value: ['string', data?.treasuryName] }, // -> Optional, if omitted, name will be taken from reward_token symbol
            { label: 'peg_token', value: ['asset', `${parseFloat(1).toFixed(data?.treasuryDigits)} ${data?.treasurySymbol}`] },
            { label: 'treasury_currency', value: ['string', data?.treasuryCurrency.value] },
            { label: 'treasury_token_multiplier', value: ['int64', data?.treasuryTokenMultiplier * 100] }
          ],

          // utility token
          [
            { label: 'content_group_label', value: ['string', 'reward_details'] },
            { label: 'reward_token_name', value: ['string', data?.utilityName] },
            { label: 'reward_token', value: ['asset', `${parseFloat(1).toFixed(data?.utilityDigits)} ${data?.utilitySymbol}`] },
            { label: 'reward_token_max_supply', value: ['asset', `${parseFloat(-1).toFixed(data?.utilityDigits)} ${data?.utilitySymbol}`] },
            { label: 'reward_to_peg_ratio', value: ['asset', `${parseFloat(1).toFixed(data?.treasuryDigits)} ${data?.treasurySymbol}`] },
            { label: 'utility_token_multiplier', value: ['int64', data?.utilityTokenMultiplier * 100] }
          ],

          // voice token
          [
            { label: 'content_group_label', value: ['string', 'voice_details'] },
            { label: 'voice_token_decay_period', value: ['int64', data?.voiceDecayPeriod] },
            { label: 'voice_token_decay_per_period', value: ['int64', data?.voiceDecayPercent] },
            { label: 'voice_token_multiplier', value: ['int64', data?.voiceTokenMultiplier * 100] }
          ]
        ]
      }
    }
  ]
  await this.$api.signTransaction(actions)
}

export const createElection = async function (context, data) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'createupvelc',
    authorization: [{
      actor: context.rootState.accounts.account,
      permission: 'active'
    }],
    data: {
      dao_id: data.daoId,
      election_config: [[
        {
          label: 'content_group_label',
          value: [
            'string',
            'details'
          ]
        },
        { label: 'upvote_start_date_time', value: ['time_point', data.startDate.replace('Z', '')] },
        { label: 'upvote_duration', value: ['int64', data.upvoteDuration] },
        { label: 'duration', value: ['int64', data.duration] }
      ]]
    }
  }]
  await this.$api.signTransaction(actions)
}
