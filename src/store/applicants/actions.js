export const fetchData = async function ({ commit }) {
  const query = `
    query applicants {
      var(func: has(applicant)){
        applicants as applicant @cascade{
          created_date
        }
      }
      applicants(func: uid(applicants), orderdesc:created_date){
        hash
        creator
        created_date
        content_groups{
          expand(_all_){
            expand(_all_)
          }
        }
      }
    }
  `
  const result = await this.$dgraph.newTxn().query(query)
  commit('addApplicants', result.data.applicants)
}

export const enroll = async function ({ commit, rootState }, { applicant, content, hash }) {
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
    commit('removeApplicant', hash)
  }
  return result
}
