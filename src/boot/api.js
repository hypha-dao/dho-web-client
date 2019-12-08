import { Api, JsonRpc } from 'eosjs'

const signTransaction = async function (actions) {
  actions.forEach(action => {
    if (!action.authorization || !action.authorization.length) {
      action.authorization = [{
        actor: this.state.accounts.account,
        permission: 'active'
      }]
    }
  })
  let transactionId = null
  let error = null
  try {
    if (this.$type === 'ual') {
      const result = await this.$ualUser.signTransaction({
        actions
      }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
      transactionId = result.transactionId
    } else if (this.$type === 'inApp') {
      const result = await this.$inAppUser.transact({
        actions
      }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
      transactionId = result.transaction_id
    }
  } catch (e) {
    error = this.$type === 'inApp' ? e.message : e.cause.message
    // this.$sentry.captureException(e)
  }
  this.commit('notifications/addNotification', { transactionId, actions, error }, { root: true })
  return error === null
}

const getTableRows = async function (options) {
  if (this.$type === 'ual') {
    return this.$ualUser.rpc.get_table_rows({
      json: true,
      ...options
    })
  } else if (this.$type === 'inApp') {
    return this.$inAppUser.rpc.get_table_rows({
      json: true,
      ...options
    })
  } else {
    return this.$defaultApi.rpc.get_table_rows({
      json: true,
      ...options
    })
  }
}

export default ({ store }) => {
  const rpc = new JsonRpc(`${process.env.NETWORK_PROTOCOL}://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`)
  store['$defaultApi'] = new Api({ rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

  store['$api'] = {
    signTransaction: signTransaction.bind(store),
    getTableRows: getTableRows.bind(store)
  }
}
