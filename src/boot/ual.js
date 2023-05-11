import { UAL } from 'universal-authenticator-library'
import { Anchor } from 'ual-anchor'
import { HyphaAuthenticator } from '@hypha-dao/ual-hypha'

export default async ({ Vue, store }) => {
  const mainChain = {
    chainId: process.env.NETWORK_CHAIN_ID,
    rpcEndpoints: [{
      protocol: 'https',
      host: store.$apiUrl.replace('https://', ''),
      port: 443
    }]
  }
  const hyphaWallet = new HyphaAuthenticator([mainChain], {
    appName: process.env.APP_NAME,
    loginContract: 'logintester1'
  })
  const anchor = new Anchor([mainChain], { appName: process.env.APP_NAME })
  anchor.ualName = 'anchor'
  hyphaWallet.ualName = 'hypha'
  const authenticators = [anchor, hyphaWallet]

  const ual = new UAL([mainChain], process.env.APP_NAME, authenticators)
  store.$ual = ual
  Vue.prototype.$ual = ual
}
