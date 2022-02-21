export const enroll = async function ({ commit, rootState }, { applicant, content }) {
  const selectedDao = this.getters['dao/selectedDao']

  const actions = [{
    account: this.$config.contracts.dao,
    name: 'enroll',
    data: {
      enroller: rootState.accounts.account,
      applicant,
      dao_id: selectedDao.docId,
      content
    }
  }]
  const result = await this.$api.signTransaction(actions)
  return result
}
