export const enroll = async function ({ commit, rootState }, { applicant, content }) {
  const selectedDao = this.getters['dao/selectedDao']

  const actions = [{
    account: this.$config.contracts.dao,
    name: 'enroll',
    data: {
      enroller: rootState.accounts.account,
      applicant,
      content,
      dao_hash: selectedDao.hash // TODO: replace this with docId
    }
  }]
  const result = await this.$api.signTransaction(actions)
  return result
}
