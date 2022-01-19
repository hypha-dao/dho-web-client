export const getSupply = async function () {
  const dho = this.getters['dao/dho']
  const daoTokens = this.getters['dao/getDaoTokens']
  const { name: daoName } = this.getters['dao/selectedDao']
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
    table: 'stat',
    limit: 200
  })

  if (governanceResult && governanceResult.rows && governanceResult.rows.length) {
    let row = governanceResult.rows.find(row => row.tenant === daoName)
    while (!row && governanceResult.more) {
      const lastIndex = governanceResult.rows[governanceResult.rows.length - 1].id
      governanceResult = await this.$api.getTableRows({
        code: governanceContract,
        scope: daoTokens.voiceToken,
        table: 'stat',
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

  let pegResult = await this.$api.getTableRows({
    code: pegContract,
    scope: daoTokens.pegToken,
    table: 'stat',
    limit: 200
  })

  if (pegResult && pegResult.rows && pegResult.rows.length) {
    let row = pegResult.rows.find(row => row.tenant === daoName)
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

  let rewardResult = await this.$api.getTableRows({
    code: rewardContract,
    scope: daoTokens.rewardToken,
    table: 'stat',
    limit: 200
  })

  if (rewardResult && rewardResult.rows && rewardResult.rows.length) {
    let row = rewardResult.rows.find(row => row.tenant === daoName)
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

  return tokens
}

export const getTreasuryData = async function () {
  const redemptions = []
  let more = true
  while (more) {
    const action = {
      code: this.$config.contracts.treasury,
      scope: this.$config.contracts.treasury,
      table: 'redemptions',
      limit: 1000
    }
    if (redemptions.length) {
      action.lower_bound = redemptions[redemptions.length - 1].redemption_id + 1
    }
    const result = await this.$api.getTableRows(action)
    if (result.rows.length) {
      redemptions.push(...result.rows.map(r => ({
        ...r,
        payments: [],
        attestations: [],
        amountPaid: 0,
        amountPaidCurrency: ''
      })))
    }
    more = result.more
  }

  const payments = []
  more = true
  while (more) {
    const action = {
      code: this.$config.contracts.treasury,
      scope: this.$config.contracts.treasury,
      table: 'payments',
      limit: 1000
    }
    if (payments.length) {
      action.lower_bound = payments[payments.length - 1].payment_id + 1
    }
    const result = await this.$api.getTableRows(action)
    if (result.rows.length) {
      payments.push(...result.rows)
    }
    more = result.more
  }
  for (const p of payments) {
    const redemption = redemptions.find(r => r.redemption_id === p.redemption_id)
    if (redemption) {
      redemption.payments.push(p)
      redemption.amountPaid += parseFloat(p.amount_paid)
      redemption.amountPaidCurrency = p.amount_paid.split(' ')[1]
      for (const attestation of p.attestations) {
        if (!redemption.attestations.some(a => a.key === attestation.key)) {
          redemption.attestations.push(attestation)
        }
      }
    }
  }
  return redemptions
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
