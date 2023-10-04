import Turndown from 'turndown'
import { Screen } from 'quasar'
import I18n from '~/utils/i18n'

export const savePayoutProposal = async function ({ rootState }, draft) {
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    { label: 'recipient', value: ['name', rootState.accounts.account] },
    { label: 'title', value: ['string', draft.title] },
    { label: 'description', value: ['string', new Turndown().turndown(draft.description)] },
    { label: 'seeds_amount', value: ['asset', `${parseFloat(draft.seeds).toFixed(4)} SEEDS`] },
    { label: 'hvoice_amount', value: ['asset', `${parseFloat(draft.hvoice).toFixed(2)} HVOICE`] },
    { label: 'hypha_amount', value: ['asset', `${parseFloat(draft.hypha).toFixed(2)} HYPHA`] },
    { label: 'husd_amount', value: ['asset', `${parseFloat(draft.husd).toFixed(2)} HUSD`] }
  ]

  if (draft.url) {
    content.push(
      { label: 'url', value: ['string', draft.url] }
    )
  }

  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propose',
    data: {
      proposer: rootState.accounts.account,
      proposal_type: 'payout',
      content_groups: [content]
    }
  }]
  let options = {}
  if (Screen.gt.md) {
    options = {
      title: I18n.t('hypha-wallet-pop-up.signTransaction.desktop.title'),
      text: I18n.t('hypha-wallet-pop-up.signTransaction.desktop.text'),
      actionText: I18n.t('hypha-wallet-pop-up.signTransaction.desktop.actionText')
    }
  } else {
    options = {
      title: I18n.t('hypha-wallet-pop-up.signTransaction.mobile.title'),
      text: I18n.t('hypha-wallet-pop-up.signTransaction.mobile.text'),
      actionText: I18n.t('hypha-wallet-pop-up.signTransaction.mobile.actionText')
    }
  }
  return this.$api.signTransaction(actions, options)
}

export const loadPayouts = async function ({ commit }, { first, offset }) {
  const query = `
  query payouts($first:int, $offset: int) {
    var(func: uid(${this.$config.dho})){
      payouts as payout @cascade{
        created_date
      }
    }
    payouts(func: uid(payouts), orderdesc:created_date, first: $first, offset: $offset){
      uid
      hash
      creator
      created_date
      content_groups {
        contents {
          label
          value
        }
      }
      votetally{
        hash
        creator
        created_date
        content_groups {
          contents {
            label
            value
          }
        }
      }
      vote {
        hash
        creator
        created_date
        content_groups{
          contents {
            label
            value
          }
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset })
  commit('addPayouts', result.data.payouts)
  return result.data.payouts.length === 0
}

export const loadUserPayouts = async function ({ commit }, { first, offset, user }) {
  const query = `
  query payouts($first:int, $offset: int, $user: string) {
    var(func: uid(${this.$config.dho})){
      payouts as payout @cascade{
        created_date
        content_groups {
          contents  @filter(eq(value,$user) and eq(label, "recipient")){
            label
            value
          }
        }
      }
    }
    payouts(func: uid(payouts), orderdesc:created_date, first: $first, offset: $offset){
      hash
      creator
      created_date
      content_groups{
        contents {
          label
          value
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset, $user: user })
  commit('addPayouts', result.data.payouts)
  return result.data.payouts.length === 0
}
