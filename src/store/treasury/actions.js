export const getSupply = async function () {
  const tokens = {
    husd: 0,
    hypha: 0,
    seeds: 0
  }

  let result = await this.$api.getTableRows({
    code: this.$config.contracts.husdToken,
    scope: 'HUSD',
    table: 'stat',
    limit: 1
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows[0]
    if (row) {
      tokens.husd = parseFloat(row.supply)
    }
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.hyphaToken,
    scope: 'HYPHA',
    table: 'stat',
    limit: 1
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows[0]
    if (row) {
      tokens.hypha = parseFloat(row.supply)
    }
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.seedsToken,
    scope: 'SEEDS',
    table: 'stat',
    limit: 1
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows[0]
    if (row) {
      tokens.seeds = parseFloat(row.supply)
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
