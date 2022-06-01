export const claimAssignmentPayment = async function (context, docId) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'claimnextper',
    data: {
      assignment_id: docId
    }
  }]
  return this.$api.signTransaction(actions)
}
export const claimAllAssignmentPayment = async function (context, { docId, numPeriods }) {
  const actions = []
  for (let i = 0; i < numPeriods; i++) {
    actions.push({
      account: this.$config.contracts.dao,
      name: 'claimnextper',
      data: {
        assignment_id: docId
      }
    })
  }
  return this.$api.signTransaction(actions)
}

export const adjustCommitment = async function ({ rootState }, { docId, commitment }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'adjustcmtmnt',
    data: {
      issuer: rootState.accounts.account,
      adjust_info: [
        [
          { label: 'assignment', value: ['int64', docId] },
          { label: 'new_time_share_x100', value: ['int64', commitment] }
        ]
      ]
    }
  }]

  return this.$api.signTransaction(actions)
}

export const adjustDeferred = async function ({ rootState }, { docId, deferred }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'adjustdeferr',
    data: {
      issuer: rootState.accounts.account,
      assignment_id: docId,
      new_deferred_perc_x100: deferred
    }
  }]

  return this.$api.signTransaction(actions)
}

export const suspendAssignment = async function ({ rootState }, { docId, reason }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'suspend',
    data: {
      reason,
      proposer: rootState.accounts.account,
      document_id: docId
    }
  }]

  return this.$api.signTransaction(actions)
}

export const withdrawFromAssignment = async function ({ rootState }, { docId, notes }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'withdraw',
    data: {
      notes,
      owner: rootState.accounts.account,
      document_id: docId
    }
  }]

  return this.$api.signTransaction(actions)
}
