import { Api, JsonRpc } from 'eosjs'
import axios from 'axios'

const signTransaction = async function (actions, options = {}) {
  actions.forEach((action) => {
    if (!action.authorization || !action.authorization.length) {
      action.authorization = [
        {
          actor: this.state.accounts.account,
          permission: 'active'
        }
      ]
    }
  })
  let transactionId = null
  let error = null

  try {
    if (this.$type === 'ual') {
      const result = await this.$ualUser.signTransaction(
        {
          actions
        },
        {
          blocksBehind: 3,
          expireSeconds: 300,
          ...options
        }
      )
      transactionId = result.transactionId
    } else if (this.$type === 'inApp') {
      const result = await this.$inAppUser.transact(
        {
          actions
        },
        {
          blocksBehind: 3,
          expireSeconds: 300
        }
      )
      transactionId = result.transaction_id
    } else if (typeof window.LightWalletChannel === 'object') {
      transactionId = await this.$lightWallet.sendTransaction(actions)
    }
  } catch (e) {
    error = this.$type === 'inApp' ? e?.message : e?.cause.message
    console.error(e) // eslint-disable-line no-console
    console.error(error) // eslint-disable-line no-console
    console.error(actions) // eslint-disable-line no-console
    this.$sentry?.setExtra('actions', JSON.stringify(actions))
    this.$sentry?.setExtra('error', error)
    this.$sentry?.captureException(e)
    throw new Error(e)
  }
  this.commit(
    'notifications/addNotification',
    { transactionId, actions, error },
    { root: true }
  )
  return error === null
}

const getTableRows = async function (options) {
  return this.$defaultApi.rpc.get_table_rows({
    json: true,
    ...options
  })
}

const getAccount = async function (account) {
  return this.$defaultApi.rpc.get_account(account)
}

export default async ({ store }) => {
  const apiUrl = await getBestEndpoint(process.env.BLOCKCHAIN_ENDPOINTS)
  store.$apiUrl = apiUrl

  const rpc = new JsonRpc(apiUrl)

  store.$defaultApi = new Api({ rpc })

  store.$api = {
    signTransaction: signTransaction.bind(store),
    getTableRows: getTableRows.bind(store),
    getAccount: getAccount.bind(store)
  }
}

const getBestEndpoint = async (
  endpoints = process.env.BLOCKCHAIN_ENDPOINTS,
  healthEndpoint = process.env.HEALTH_ENDPOINT
) => {
  const promises = []
  for (const endpoint of endpoints.split(',')) {
    promises.push(pingEndpoint(endpoint, healthEndpoint))
  }
  const result = await Promise.all(promises)
  result.sort((a, b) => a.time - b.time)
  return result[0].url
}

const pingEndpoint = async (url, healthEndoint) => {
  const start = Date.now()
  const healthUrl = healthEndoint ? `${url}/${healthEndoint}` : url
  try {
    await axios.get(`${healthUrl}`, {
      timeout: 5000
    })
  } catch (e) {
    return { time: 50000, url }
  }
  return { time: Date.now() - start, url }
}
