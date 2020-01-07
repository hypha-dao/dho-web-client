export const fetchData = async function ({ commit, state }) {
  const result = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
    table: 'applicants',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].applicant : null,
    limit: state.list.pagination.limit,
    reverse: true
  })

  commit('addApplicants', result)
}

export const enroll = async function ({ commit, rootState }, { applicant, content }) {
  const actions = [{
    account: process.env.SMARTCONTRACT,
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
