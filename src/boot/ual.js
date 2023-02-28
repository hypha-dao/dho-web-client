import { UAL } from 'universal-authenticator-library'
import { Anchor } from 'ual-anchor'
import { SeedsAuthenticator } from 'ual-seeds'

export default async ({ Vue, store }) => {
  const mainChain = {
    chainId: process.env.NETWORK_CHAIN_ID,
    rpcEndpoints: [{
      protocol: 'https',
      host: store.$eosApiUrl.replace('https://', ''),
      port: 443
    }]
  }
  const lw = new SeedsAuthenticator([mainChain], { appName: process.env.APP_NAME })
  const anchor = new Anchor([mainChain], { appName: process.env.APP_NAME })
  anchor.ualName = 'anchor'
  lw.ualName = 'seeds'
  const authenticators = [
    anchor,
    lw
  ]

  const ual = new UAL([mainChain], process.env.APP_NAME, authenticators)
  store.$ual = ual
  Vue.prototype.$ual = ual
}
