export const fetchData = async function ({ commit, state }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'applicants',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].applicant : null,
    limit: state.list.pagination.limit,
    reverse: true
  })

  commit('addApplicants', result)
}

export const enroll = async function ({ commit, rootState }, { applicant, content }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'enroll',
    data: {
      enroller: rootState.accounts.account,
      applicant,
      content
    }
  }]
  const result = await this.$api.signTransaction(actions)
  if (result) {
    commit('removeApplicant', applicant)
  }
  return result
}
