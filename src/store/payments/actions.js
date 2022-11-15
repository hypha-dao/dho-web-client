export const fetchData = async function ({ commit, state }, { account }) {
  const options = {
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'payments',
    lower_bound: null,
    upper_bound: null,
    limit: 1000
  }
  if (account) {
    options.lower_bound = account
    options.upper_bound = account
    options.index_position = 3
    options.key_type = 'i64'
  }
  const result = await this.$api.getTableRows(options)
  commit('addPayments', result)
}

export const countPayments = async function ({ rootState }) {
  // TODO: Get rid of 'has(payment)' call, in lieu of typed get?
  const query = `
  query payments($recipient:string) {
    var(func: has(payment)) {
      payments as payment @cascade{
        created_date
        content_groups {
          contents @filter(eq(value,$recipient) and eq(label, "recipient")){
            label
            value
          }
        }
      }
    }
    payments(func: uid(payments)) {
      total: count(uid)
    }
  }`
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $recipient: rootState.accounts.account })
  return result.data.payments[0].total
}

export const loadPayments = async function ({ rootState }, { page, rowsPerPage }) {
  // TODO: Get rid of 'has(payment)' call, in lieu of typed get?
  const query = `
  query payments($recipient:string, $first:int, $offset: int) {
    var(func: has(payment)){
      payments as payment @cascade{
        created_date
        content_groups {
          contents  @filter(eq(value,$recipient) and eq(label, "recipient")){
            label
            value
          }
        }
      }
    }
    payments(func: uid(payments), orderdesc:created_date, first: $first, offset: $offset){
      hash
      creator
      created_date
      content_groups{
        contents {
          label
          value
          type
        }
      }
    }
  }`
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $recipient: rootState.accounts.account, $first: '' + rowsPerPage, $offset: '' + (page - 1) * rowsPerPage })
  return result.data.payments
}

export const fetchRedemptions = async function ({ commit, state }, { account }) {
  const options = {
    code: this.$config.contracts.treasury,
    scope: this.$config.contracts.treasury,
    table: 'redemptions',
    // lower_bound: account,
    // upper_bound: account,
    // index_position: 3,
    // key_type: 'i64',
    limit: 1000
  }
  // TODO use index
  const result = await this.$api.getTableRows(options)
  if (account && result.rows.length) {
    result.rows = result.rows.filter(r => r.redeemer === account)
  }
  commit('addOpenRedemptions', result)
}

export const redeemToken = async function ({ rootState }, { quantity, memo }) {
  const selectedDao = this.getters['dao/selectedDao']
  if (!selectedDao.docId) return
  const dho = this.getters['dao/dho']
  const pegContract = dho.settings[0].settings_pegTokenContract_n
  const mainContract = dho.settings[0].contract
  console.log('rootState', mainContract, selectedDao.docId)
  const actions = [
    {
      account: pegContract,
      name: 'transfer',
      data: {
        from: rootState.accounts.account,
        to: mainContract,
        quantity,
        memo: 'redeem'
      }
    },
    {
      account: mainContract,
      name: 'redeem',
      data: {
        dao_id: selectedDao.docId,
        amount: quantity
      }
    }
  ]
  return this.$api.signTransaction(actions)
}

export const redeemAddress = async function ({ rootState }) {
  const result = await this.$api.getTableRows({
    code: 'kv.hypha',
    scope: 'kv.hypha',
    table: 'kvs',
    index_position: 3,
    key_type: 'i64',
    lower_bound: rootState.accounts.account,
    upper_bound: rootState.accounts.account,
    limit: 1000
  })
  if (result && result.rows.length) {
    const defaultAddr = result.rows.find(r => r.key === 'defaultaddr')
    if (defaultAddr) {
      if (result.rows.some(r => r.key === defaultAddr.value)) {
        return defaultAddr.value
      }
    }
    return false
  }
  return false
}

export const buySeeds = async function ({ rootState }, quantity) {
  const dho = this.getters['dao/dho']
  const pegContract = dho.settings[0].settings_pegTokenCon
  const actions = [
    {
      account: pegContract,
      name: 'transfer',
      data: {
        from: rootState.accounts.account,
        to: this.$config.contracts.tlostoSeeds,
        quantity,
        memo: 'DHO Hypha Buy Seeds'
      }
    }
  ]
  return this.$api.signTransaction(actions)
}

export const buyHypha = async function ({ rootState }, quantity) {
  const dho = this.getters['dao/dho']
  const pegContract = dho.settings[0].settings_pegTokenCon
  const actions = [
    {
      account: pegContract,
      name: 'transfer',
      data: {
        from: rootState.accounts.account,
        to: this.$config.contracts.dao,
        quantity,
        memo: 'buy'
      }
    }
  ]
  return this.$api.signTransaction(actions)
}
