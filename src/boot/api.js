import { Api, JsonRpc } from 'eosjs'
import encoding from 'text-encoding'

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
    } else if (typeof window.LightWalletChannel === 'object') {
      const firstAction = actions[0]
      transactionId = await this.$lightWallet.sendTransaction(firstAction)
    }
  } catch (e) {
    error = this.$type === 'inApp' ? e.message : e.cause.message
    console.error(error) // eslint-disable-line no-console
    console.error(actions) // eslint-disable-line no-console
    this.$sentry.setExtra('actions', JSON.stringify(actions))
    this.$sentry.setExtra('error', error)
    this.$sentry.captureException(e)
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

const getAccount = async function (account) {
  if (this.$type === 'ual') {
    return this.$ualUser.rpc.get_account(account)
  } else if (this.$type === 'inApp') {
    return this.$inAppUser.rpc.get_account(account)
  } else {
    return this.$defaultApi.rpc.get_account(account)
  }
}

export default ({ store }) => {
  if (!window.TextEncoder) {
    window.TextEncoder = encoding.TextEncoder
  }

  if (!window.TextDecoder) {
    window.TextDecoder = encoding.TextDecoder
  }

  const rpc = new JsonRpc(`${process.env.NETWORK_PROTOCOL}://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`)
  store['$defaultApi'] = new Api({ rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

  store['$api'] = {
    signTransaction: signTransaction.bind(store),
    getTableRows: getTableRows.bind(store),
    getAccount: getAccount.bind(store)
  }
}
