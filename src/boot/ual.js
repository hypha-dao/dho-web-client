import { UAL } from 'universal-authenticator-library'
import { Anchor } from 'ual-anchor'
import { SeedsAuthenticator } from 'ual-seeds-wallet'
// import { Scatter } from 'ual-scatter'
// import { Sqrl } from '@smontero/ual-sqrl'

export default async ({ Vue, store }) => {
  const mainChain = {
    chainId: process.env.NETWORK_CHAIN_ID,
    rpcEndpoints: [{
      protocol: 'https',
      host: store.$apiUrl.replace('https://', ''),
      port: 443
    }]
  }
  // const sqrl = new Sqrl([mainChain], { appName: process.env.APP_NAME })
  // sqrl.ualName = 'sqrl'
  const anchor = new Anchor([mainChain], { appName: process.env.APP_NAME })
  const lw = new SeedsAuthenticator([mainChain], { appName: process.env.APP_NAME })
  anchor.ualName = 'anchor'
  // const scatter = new Scatter([mainChain], { appName: process.env.APP_NAME })
  // scatter.ualName = 'scatter'
  const authenticators = [
    anchor,
    lw
    // sqrl,
    // scatter
  ]

  const ual = new UAL([mainChain], process.env.APP_NAME, authenticators)
  store.$ual = ual
  Vue.prototype.$ual = ual
}
