import camelToSnakeCase from '~/utils/camelToSnakeCase'

export const createDAO = async function (context, { data }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'createdao',
    config: [
      // GROUP: details
      [
        { label: 'content_group_label', value: ['string', 'details'] },
        { label: 'dao_name', value: ['name', data?.name] },
        { label: 'dao_title', value: ['string', data?.name] },
        { label: 'dao_description', value: ['string', data?.description] },

        { label: 'is_template', value: ['int64', 0] },
        { label: 'dao_template', value: ['int64', data?.template] },

        { label: 'reward_token', value: ['asset', `${parseFloat(1).toFixed(data?.utilityDigits)} ${data?.utilitySymbol}`] },
        { label: 'reward_token_max_supply', value: ['asset', `${parseFloat(-1).toFixed(data?.utilityDigits)} ${data?.utilitySymbol}`] },
        { label: 'reward_to_peg_ratio', value: ['asset', `${parseFloat(1).toFixed(data?.treasuryDigits)} ${data?.treasurySymbol}`] },
        { label: 'voice_token', value: ['asset', `${parseFloat(1).toFixed(data?.voiceDigits)} ${data?.voiceSymbol}`] },
        { label: 'peg_token', value: ['asset', `${parseFloat(1).toFixed(data?.treasuryDigits)} ${data?.treasurySymbol}`] },
        { label: 'use_seeds', value: ['int64', data?.use_seeds ? 1 : 0] },

        { label: 'voting_duration_sec', value: ['int64', data?.votingDurationSec] },
        { label: 'period_duration_sec', value: ['int64', data?.periodDurationSec] },
        { label: 'voting_alignment_x100', value: ['int64', data?.votingAlignmentPercent] },
        { label: 'voting_quorum_x100', value: ['int64', data?.votingQuorumPercent] },

        // TODO
        { label: 'voice_token_decay_period', value: ['int64', 604800] },
        { label: 'voice_token_decay_per_period_x10M', value: ['int64', 100000] },

        { label: 'reward_token_multiplier_x100', value: ['int64', data?.utilityTokenMultiplier] },
        { label: 'voice_token_multiplier_x100', value: ['int64', data?.voiceTokenMultiplier] },
        { label: 'peg_token_multiplier_x100', value: ['int64', data?.treasuryTokenMultiplier] },

        { label: 'onboarder_account', value: ['name', data?.onboarder_account] }
      ],

      // GROUP: core members
      [
        { label: 'content_group_label', value: ['string', 'core_members'] },
        // EXAMPLE: { label: 'account', value: ['name', data?.name] }
        ...data?.members.map(member => ({ label: 'account', value: ['name', member?.account] }))
      ],

      // GROUP: salary bands
      [
        { label: 'content_group_label', value: ['string', 'salary_bands'] },
        // EXAMPLE: { "label": "Band 1", "value": ["asset", "70000.00 USD"] },
        ...data.salaries.map(salary => ({ label: salary?.name, value: ['asset', `${parseFloat(salary?.value).toFixed(2)} USD`] }))
      ],

      // GROUP: design style
      [
        { label: 'content_group_label', value: ['string', 'style'] },
        { label: 'logo', value: ['string', data?.logo] },
        { label: 'primary_color', value: ['string', data?.primaryColor] },
        { label: 'secondary_color', value: ['string', data?.secondaryColor] }
      ]
    ]

  }]

  // console.log((JSON.stringify(actions)))

  return this.$api.signTransaction(actions)
}

export const updateSettings = async function (context, { docId, data }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'setdaosetting',
    data: {
      dao_id: docId,
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
  }]

  return this.$api.signTransaction(actions)
}
