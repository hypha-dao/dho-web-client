import { UAL } from 'universal-authenticator-library'
import { Anchor } from 'ual-anchor'
import { HyphaAuthenticator } from '@hypha-dao/ual-hypha'
import { SeedsAuthenticator } from 'ual-seeds'
import { Screen } from 'quasar'
import I18n from '~/utils/i18n'

const DEFAULT_LOGIN_OPTIONS = {
  title: Screen.gt.md ? I18n.t('hypha-wallet-pop-up.signTransaction.desktop.login') : I18n.t('hypha-wallet-pop-up.signTransaction.mobile.login'),
  text: Screen.gt.md ? I18n.t('hypha-wallet-pop-up.signTransaction.desktop.text') : I18n.t('hypha-wallet-pop-up.signTransaction.mobile.text'),
  actionText: Screen.gt.md ? I18n.t('hypha-wallet-pop-up.signTransaction.desktop.actionText') : I18n.t('hypha-wallet-pop-up.signTransaction.mobile.actionText')
}
const DEFAULT_SIGN_TRANSACTION_OPTIONS = {
  title: Screen.gt.md ? I18n.t('hypha-wallet-pop-up.signTransaction.desktop.title') : I18n.t('hypha-wallet-pop-up.signTransaction.mobile.title'),
  text: Screen.gt.md ? I18n.t('hypha-wallet-pop-up.signTransaction.desktop.text') : I18n.t('hypha-wallet-pop-up.signTransaction.mobile.text'),
  actionText: Screen.gt.md ? I18n.t('hypha-wallet-pop-up.signTransaction.desktop.actionText') : I18n.t('hypha-wallet-pop-up.signTransaction.mobile.actionText')
}

const UAL_HYPHA_TRANSLATIONS = {
  login: DEFAULT_LOGIN_OPTIONS,
  signTransaction: DEFAULT_SIGN_TRANSACTION_OPTIONS
}

export default async ({ Vue, store }) => {
  const mainChain = {
    chainId: process.env.NETWORK_CHAIN_ID,
    rpcEndpoints: [
      {
        protocol: 'https',
        host: store.$apiUrl.replace('https://', ''),
        port: 443
      }
    ]
  }
  const hyphaWallet = new HyphaAuthenticator([mainChain], {
    appName: process.env.APP_NAME,
    loginContract: process.env.LOGIN_CONTRACT,
    translation: UAL_HYPHA_TRANSLATIONS
  })
  const lw = new SeedsAuthenticator([mainChain], { appName: process.env.APP_NAME })
  const anchor = new Anchor([mainChain], { appName: process.env.APP_NAME })
  anchor.ualName = 'anchor'
  hyphaWallet.ualName = 'hypha'
  lw.ualName = 'seeds'
  const authenticators = [hyphaWallet, anchor, lw]

  const ual = new UAL([mainChain], process.env.APP_NAME, authenticators)
  store.$ual = ual
  Vue.prototype.$ual = ual
}
