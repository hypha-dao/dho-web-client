export const getSupply = async function () {
  const dho = this.getters['dao/dho']
  const daoTokens = this.getters['dao/getDaoTokens']
  const { name: daoName } = this.getters['dao/selectedDao']
  const { usesSeeds } = this.getters['dao/daoSettings']
  const tokens = {}
  if (!dho) return tokens

  const settings = dho.settings[0]
  const {
    settings_governanceTokenContract_n: governanceContract,
    settings_pegTokenContract_n: pegContract,
    settings_rewardTokenContract_n: rewardContract
  } = settings

  let governanceResult = await this.$api.getTableRows({
    code: governanceContract,
    scope: daoTokens.voiceToken,
    table: 'stat.v2',
    limit: 200
  })

  let rewardResult = await this.$api.getTableRows({
    code: rewardContract,
    scope: daoTokens.rewardToken,
    table: 'stat',
    limit: 200
  })

  if (rewardResult && rewardResult.rows && rewardResult.rows.length) {
    let row = rewardResult.rows[0]
    while (!row && rewardResult.more) {
      const lastIndex = rewardResult.rows[rewardResult.rows.length - 1].id
      rewardResult = await this.$api.getTableRows({
        code: rewardContract,
        scope: daoTokens.rewardToken,
        table: 'stat',
        limit: 200,
        lower_bound: lastIndex
      })
      row = rewardResult.rows.find(row => row.tenant === daoName)
    }
    if (row) {
      const [amount, token] = row.supply.split(' ')
      tokens[token] = parseFloat(amount)
    }
  }

  let pegResult = await this.$api.getTableRows({
    code: pegContract,
    scope: daoTokens.pegToken,
    table: 'stat',
    limit: 200
  })

  if (pegResult && pegResult.rows && pegResult.rows.length) {
    let row = pegResult.rows[0]
    while (!row && pegResult.more) {
      const lastIndex = pegResult.rows[pegResult.rows.length - 1].id
      pegResult = await this.$api.getTableRows({
        code: pegContract,
        scope: daoTokens.pegToken,
        table: 'stat',
        limit: 200,
        lower_bound: lastIndex
      })
      row = pegResult.rows.find(row => row.tenant === daoName)
    }
    if (row) {
      const [amount, token] = row.supply.split(' ')
      tokens[token] = parseFloat(amount)
    }
  }

  if (governanceResult && governanceResult.rows && governanceResult.rows.length) {
    let row = governanceResult.rows.find(row => row.tenant === daoName)
    while (!row && governanceResult.more) {
      const lastIndex = governanceResult.rows[governanceResult.rows.length - 1].id
      governanceResult = await this.$api.getTableRows({
        code: governanceContract,
        scope: daoTokens.voiceToken,
        table: 'stat.v2',
        limit: 200,
        lower_bound: lastIndex
      })
      row = governanceResult.rows.find(row => row.tenant === daoName)
    }
    if (row) {
      const [amount, token] = row.supply.split(' ')
      tokens[token] = parseFloat(amount)
    }
  }

  if (usesSeeds) {
    const result = await this.$api.getTableRows({
      code: this.$config.contracts.seedsToken,
      scope: 'SEEDS',
      table: 'stat',
      limit: 1
    })
    const row = result.rows[0]
    if (row) {
      const [amount, token] = row.supply.split(' ')
      tokens[token] = parseFloat(amount)
    }
  }

  return tokens
}

export const getTreasurers = async function () {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.treasury,
    scope: this.$config.contracts.treasury,
    table: 'treasurers',
    limit: 1000
  })

  return result.rows
}

export const sendNewPayment = async function ({ rootState }, { id, amount, network, trxId, comment }) {
  const actions = [{
    account: this.$config.contracts.treasury,
    name: 'newpayment',
    data: {
      treasurer: rootState.accounts.account,
      redemption_id: id,
      amount,
      notes: [
        { key: 'network', value: network },
        { key: 'trx_id', value: trxId },
        { key: 'comment', value: comment }
      ]
    }
  }]
  return this.$api.signTransaction(actions)
}

export const endorsePayment = async function ({ rootState }, { redemptionId, amount, paymentId, comment }) {
  const actions = [{
    account: this.$config.contracts.treasury,
    name: 'attestpaymnt',
    data: {
      treasurer: rootState.accounts.account,
      redemption_id: redemptionId,
      payment_id: paymentId,
      amount,
      notes: [
        { key: 'comment', value: comment }
      ]
    }
  }]
  return this.$api.signTransaction(actions)
}
