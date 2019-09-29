import { JsonRpc } from 'eosjs'

// TODO refacto to use eos-transit or passport
export default async ({ Vue, store }) => {
  const rpc = new JsonRpc(`${process.env.NETWORK_PROTOCOL}://${process.env.NETWORK_HOST}`)

  rpc.getTableRows = function ({ code, scope, table, limit, lowerBound, upperBound, reversed }) {
    const options = {
      code,
      scope,
      table,
      limit,
      reversed,
      lower_bound: lowerBound,
      upper_bound: upperBound
    }

    return this.get_table_rows(options)
  }.bind(rpc)

  Vue.prototype.$transit = rpc
  store['$transit'] = rpc

  const accountName = localStorage.getItem('accountName')
  const privateKey = localStorage.getItem('privateKey')
  if (accountName && privateKey) {
    await store.dispatch('wallet/openWallet', { accountName, privateKey }, { root: true })
  }
}
