import wallet from 'src/wallet'
import { LocalStorage } from 'quasar'

export const validateInviteCode = async function (context, inviteCode) {
  const { isValid } = await this.$axios.post('/checkInviteCode', {
    inviteCode
  })
  return isValid
}

/**
 * Refactoring
 */
export const createWallet = async ({ dispatch, commit }, payload) => {
  const { accountName, privateKey, publicKey, inviteCode } = payload

  try {
    commit('startTransaction', 'Register account')

    const transactionId = await wallet.createAccount({ accountName, publicKey, inviteCode })

    if (transactionId) {
      commit('finishTransaction', transactionId)

      LocalStorage.set('accountName', accountName)
      LocalStorage.set('privateKey', privateKey)

      await wallet.init({ privateKey, accountName })

      dispatch('feeds/loadUser', { accountName }, { root: true })

      commit('login', { accountName })
    } else {
      commit('catchTransaction', `Cannot register account ${accountName}`)
    }
  } catch (err) {
    commit('catchError', err)
  }
}

export const openWallet = async function ({ dispatch, commit }, payload) {
  const { accountName, privateKey } = payload

  LocalStorage.set('accountName', accountName)
  LocalStorage.set('privateKey', privateKey)

  try {
    await wallet.init({ accountName, privateKey })
    await dispatch('profile/me', accountName, { root: true })
    // TODO remove
    const user = await this.$stream.login(accountName)
    commit('feeds/setUser', user, { root: true })
    commit('connect')
    commit('login', { accountName })
    return true
  } catch (err) {
    commit('catchError', err)
    return false
  }
}

export const closeWallet = async ({ dispatch, commit }, payload) => {
  LocalStorage.remove('accountName')
  LocalStorage.remove('privateKey')

  commit('disconnect')
  commit('logout')
}

export const connectWallet = async ({ dispatch, commit }, payload) => {
  const privateKey = (payload && payload.privateKey) || null
  const accountName = (payload && payload.accountName) || null

  try {
    await wallet.init({ privateKey, accountName })

    if (accountName) {
      dispatch('feeds/loadUser', { accountName }, { root: true })
      commit('login', { accountName })
      await dispatch('profile/me', accountName, { root: true })
    }
    console.log('connect wallet')
    commit('connect')
  } catch (err) {
    commit('catchError', err)
  }
}

export const becomeMember = async ({ dispatch, commit }, payload) => {
  commit('startTransaction', 'Become Member')

  try {
    const { inviteCode } = payload
    const transactionId = await wallet.becomeMember({ inviteCode })

    commit('finishTransaction', transactionId)
  } catch (err) {
    commit('catchTransaction', err)
  }
}

export const sendTransaction = async ({ commit }, payload) => {
  commit('startTransaction', payload.name)
  try {
    const result = await wallet.transact(payload.transaction)
    commit('finishTransaction', result.transaction_id)
  } catch (err) {
    commit('catchTransaction', err)
  }
}

export const sendVote = ({ dispatch }, payload) => {
  const { ballots, direction } = payload

  const trail = wallet.getTrailAccount()
  const user = wallet.getUserAccount()

  let transaction = {
    actions: ballots.map(ballotId => {
      return {
        account: trail,
        name: 'castvote',
        authorization: [{
          actor: user,
          permission: 'active'
        }],
        data: {
          voter: user,
          ballot_id: ballotId,
          direction: direction
        }
      }
    })
  }

  console.log({ transaction })

  dispatch('wallet/sendTransaction', {
    name: 'Send Votes',
    transaction
  }, { root: true })

  const serializedUserVotes = LocalStorage.getItem('userVotes') || '{ "ballots": {} }'
  const currentVotes = JSON.parse(serializedUserVotes)

  let newBallots = {
    ...currentVotes.ballots
  }
  ballots.forEach(ballotId => {
    newBallots[ballotId] = true
  })

  const updatedVotes = {
    ...currentVotes,
    ballots: newBallots
  }

  console.log({ updatedVotes })

  LocalStorage.set('userVotes', JSON.stringify(updatedVotes))
}
