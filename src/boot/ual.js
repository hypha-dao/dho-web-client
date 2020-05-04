import { UAL } from 'universal-authenticator-library'
import { Anchor } from 'ual-anchor'
import { KeycatAuthenticator } from '@smontero/ual-keycat'
import { Lynx } from '@smontero/ual-lynx'
import { Scatter } from 'ual-scatter'
import { Sqrl } from '@smontero/ual-sqrl'
import { TokenPocket } from '@smontero/ual-token-pocket'

export default async ({ Vue, store }) => {
  const mainChain = {
    chainId: process.env.NETWORK_CHAIN_ID,
    rpcEndpoints: [{
      protocol: process.env.NETWORK_PROTOCOL,
      host: process.env.NETWORK_HOST,
      port: process.env.NETWORK_PORT
    }]
  }

  const authenticators = [
    new Sqrl([mainChain], { appName: process.env.APP_NAME }),
    new Scatter([mainChain], { appName: process.env.APP_NAME }),
    new KeycatAuthenticator([mainChain]),
    new Lynx([mainChain]),
    new TokenPocket([mainChain]),
    new Anchor([mainChain], { appName: process.env.APP_NAME })
  ]

  const ual = new UAL([mainChain], process.env.APP_NAME, authenticators)
  store['$ual'] = ual
  Vue.prototype.$ual = ual
}
