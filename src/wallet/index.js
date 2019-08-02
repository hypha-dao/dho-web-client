import { JsonRpc, Api } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { Keygen } from 'eosjs-keygen'
import fetch from 'cross-fetch'
// import { TextEncoder, TextDecoder } from 'util'

const contractAccount = 'hyphadaobal1'
const trailAccount = 'eosio.trail'
const eosioAccount = 'eosio'
const applicationAccount = 'seedsharvest'
const applicationPrivateKey = '5KgtSt476rUprrvJ2uC1nkJJwQc4pMJY3VMEPGefq6i92WbKiyw'

const NODE_ENDPOINT = 'https://api.eos.miami'

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

  const createAccount = async ({ publicKey, userAccount }) => {
    const result = await transact({
      actions: [{
        account: eosioAccount,
        name: 'newaccount',
        authorization: [{
          actor: applicationAccount,
          permission: 'owner'
        }],
        data: {
          creator: applicationAccount,
          owner: publicKey,
          active: publicKey,
          name: userAccount
        }
      }, {
        account: eosioAccount,
        name: 'buyrambytes',
        authorization: [{
          actor: applicationAccount,
          permission: 'owner'
        }],
        data: {
          payer: applicationAccount,
          receiver: userAccount,
          bytes: 32084
        }
      }, {
        account: eosioAccount,
        name: 'delegatebw',
        authorization: [{
          actor: applicationAccount,
          permission: 'owner'
        }],
        data: {
          from: applicationAccount,
          receiver: userAccount,
          stake_net_quantity: `1 TLOS`,
          stake_cpu_quantity: `1 TLOS`,
          transfer: 0
        }
      }]
    })

    return result.transaction_id
  }

  const init = ({ privateKey, accountName }) => {
    if (privateKey) {
      signatureProvider = new JsSignatureProvider([ privateKey ])
    } else {
      signatureProvider = new JsSignatureProvider([ applicationPrivateKey ])
    }

    userAccount = accountName || null

    rpc = new JsonRpc(NODE_ENDPOINT, { fetch })
    api = new Api({ rpc, signatureProvider, textEncoder, textDecoder })
  }

  const getTableRows = (code, scope, table) => {
    console.log('get rows')

    return rpc.get_table_rows({
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
