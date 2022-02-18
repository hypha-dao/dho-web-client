export const fetchData = async function ({ commit }) {
  const query = `
    query applicants {
      var(func: uid(${this.$config.dho})){
        applicants as applicant @cascade{
          created_date
        }
      }
      applicants(func: uid(applicants), orderdesc:created_date){
        hash
        creator
        created_date
        content_groups{
          contents {
            label
            value
            type
          }
        }
      }
    }
  `
  const result = await this.$dgraph.newTxn().query(query)
  commit('addApplicants', result.data.applicants)
}

export const enroll = async function ({ commit, rootState }, { applicant, content }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'enroll',
    data: {
      enroller: rootState.accounts.account,
      applicant,
      dao_id: rootState.dao.docId,
      content
    }
  }]
  const result = await this.$api.signTransaction(actions)
  if (result) {
    commit('removeApplicant', rootState.dao.docId)
  }
  return result
}
