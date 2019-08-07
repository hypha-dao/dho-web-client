import { JsonRpc, Api } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { Keygen } from 'eosjs-keygen'
import fetch from 'cross-fetch'
// import { TextEncoder, TextDecoder } from 'util'

const contractAccount = 'hyphadaomain'
const trailAccount = 'eosio.trail'

const nodeEndpoint = 'https://api.eos.miami'
const serviceEndpoint = 'https://diadem.host/hypha'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export default (function () {
  let signatureProvider = null
  let rpc = null
  let api = null
  let userAccount = null

  const generateKeys = async () => {
    const keys = await Keygen.generateMasterKeys()

    return {
      privateKey: keys.privateKeys.active,
      publicKey: keys.publicKeys.active
    }
  }

  const createAccount = async ({ publicKey, accountName }) => {
    const rawResponse = await fetch(`${serviceEndpoint}/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accountName, publicKey })
    })

    const response = await rawResponse.json()

    if (response.error) {
      console.error(response.error)
      return null
    }

    return response.transaction_id
  }

  const init = ({ privateKey, accountName } = {}) => {
    if (privateKey) {
      signatureProvider = new JsSignatureProvider([ privateKey ])
    } else {
      signatureProvider = new JsSignatureProvider([])
    }

    userAccount = accountName || null

    rpc = new JsonRpc(nodeEndpoint, { fetch })
    api = new Api({ rpc, signatureProvider, textEncoder, textDecoder })
  }

  const getTableRows = (code, scope, table) => {
    return rpc.get_table_rows({
      json: true,
      code,
      scope,
      table,
      limit: 100
    })
  }

  const transact = (transaction, config = {
    sign: true,
    broadcast: true,
    blocksBehind: 3,
    expireSeconds: 60
  }) => {
    return api.transact(transaction, config)
  }

  const requireWallet = (fn) => (...args) => {
    if (!userAccount) {
      throw new Error('Wallet not ready')
    }
    return fn(...args)
  }

  const getUserAccount = () => userAccount

  const getContractAccount = () => contractAccount

  const getTrailAccount = () => trailAccount

  return Object.freeze({
    init,
    generateKeys,
    createAccount,
    getContractAccount,
    getTrailAccount,
    getUserAccount: requireWallet(getUserAccount),
    getTableRows: getTableRows,
    transact: requireWallet(transact)
  })
})()
