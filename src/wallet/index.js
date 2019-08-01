import { initAccessContext } from 'eos-transit'
import keycat from 'eos-transit-keycat-provider'

const appName = 'hyphadao'
const contractAccount = 'hyphadaobal1'
const trailAccount = 'eosio.trail'

const network = {
  protocol: 'https',
  host: 'api.eos.miami',
  port: 443,
  chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'
}

export default (function () {
  let wallet = null
  let accountInfo = null

  const walletProviders = [
    keycat()
  ]

  const connect = async (walletId, subscribeCallback) => {
    const options = {
      appName,
      network,
      walletProviders
    }

    const accessContext = initAccessContext(options)

    wallet = accessContext.initWallet(
      accessContext.getWalletProviders().find(r => r.id === walletId)
    )

    wallet.subscribe(subscribeCallback)

    await wallet.connect()

    accountInfo = await wallet.login()
  }

  const terminate = () => {
    return wallet.terminate()
  }

  const getTableRows = (code, scope, table) => {
    return wallet.eosApi.rpc.get_table_rows({
      json: true,
      code,
      scope,
      table
    })
  }

  const transact = (transaction, config = {
    sign: true,
    broadcast: true,
    blocksBehind: 3,
    expireSeconds: 60
  }) => {
    return wallet.eosApi.transact(transaction, config)
  }

  const requireWallet = (fn) => (...args) => {
    if (!wallet) {
      throw new Error('Wallet not ready')
    }
    if (!accountInfo) {
      throw new Error('User not authorized')
    }
    return fn(...args)
  }

  const getUserAccount = () => accountInfo.account_name

  const getContractAccount = () => contractAccount

  const getTrailAccount = () => trailAccount

  return Object.freeze({
    connect,
    terminate: requireWallet(terminate),
    getTableRows: requireWallet(getTableRows),
    transact: requireWallet(transact),
    getUserAccount: requireWallet(getUserAccount),
    getContractAccount,
    getTrailAccount
  })
})()
