export const fetchProposal = async function (context, { id, isHistory }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: isHistory ? 'proparchive' : 'proposal',
    table: 'objects',
    lower_bound: parseInt(id),
    upper_bound: parseInt(id),
    limit: 1
  })

  if (result && result.rows.length) {
    return result.rows[0]
  }
  return null
}

export const fetchData = async function ({ commit }, { type, roleId, isHistory }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: isHistory ? 'proparchive' : 'proposal',
    table: 'objects',
    lower_bound: type,
    upper_bound: type,
    index_position: 5, // by type
    key_type: 'i64',
    reverse: true,
    limit: 1000
  })
  if (result.rows && roleId) {
    result.rows = result.rows.filter(r => {
      const rId = r.ints.find(i => i.key === 'role_id')
      return rId && rId.value === parseInt(roleId)
    })
  }
  commit('addProposals', result)

  if (!isHistory) {
    let resultEdit = await this.$api.getTableRows({
      code: this.$config.contracts.dao,
      scope: 'proposal',
      table: 'objects',
      lower_bound: 'edit',
      upper_bound: 'edit',
      index_position: 5, // by type
      key_type: 'i64',
      reverse: true,
      limit: 1000
    })
    if (resultEdit.rows) {
      resultEdit.rows = resultEdit.rows.filter(r => r.names.find(n => n.key === 'original_scope').value === type)
      if (roleId) {
        resultEdit.rows = resultEdit.rows.filter(r => {
          const rId = r.ints.find(i => i.key === 'role_id')
          return rId && rId.value === parseInt(roleId)
        })
      }
    }

    commit('addProposals', { rows: resultEdit.rows, more: resultEdit.more || result.more })

    let resultSuspend = await this.$api.getTableRows({
      code: this.$config.contracts.dao,
      scope: 'proposal',
      table: 'objects',
      lower_bound: 'suspend',
      upper_bound: 'suspend',
      index_position: 5, // by type
      key_type: 'i64',
      reverse: true,
      limit: 1000
    })
    if (resultSuspend.rows) {
      resultSuspend.rows = resultSuspend.rows.filter(r => r.names.find(n => n.key === 'original_scope').value === type)
      if (roleId) {
        resultSuspend.rows = resultSuspend.rows.filter(r => {
          const rId = r.ints.find(i => i.key === 'role_id')
          return rId && rId.value === parseInt(roleId)
        })
      }
    }

    commit('addProposals', { rows: resultSuspend.rows, more: resultSuspend.more || resultEdit.more || result.more })
  }
}

export const fetchHistoryFiltered = async function ({ commit }, { type, username }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'proparchive',
    table: 'objects',
    lower_bound: type,
    upper_bound: type,
    index_position: 5, // by type
    key_type: 'i64',
    reverse: true,
    limit: 1000
  })
  if (result.rows && username) {
    result.rows = result.rows.filter(r => {
      const owner = r.names.find(n => n.key === 'owner')
      return owner && owner.value === username
    })
  }
  commit('addProposals', result)
}

export const closeProposal = async function (context, id) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'closeprop',
    data: {
      proposal_id: id
    }
  }]

  return this.$api.signTransaction(actions)
}

export const getUserProposals = async function (context, account) {
  let userProposals = []
  let more = true
  let results = { rows: [] }
  while (more) {
    results = await this.$api.getTableRows({
      code: this.$config.contracts.dao,
      scope: 'proposal',
      table: 'objects',
      lower_bound: results.rows.length ? parseInt(new Date(results.rows[results.rows.length - 1].created_date).getTime() / 1000) : null,
      limit: 1000,
      reverse: true
    })
    userProposals = userProposals.concat(results.rows.filter(r => {
      const obj = r.names.find(n => n.key === 'owner')
      return obj && obj.value === account
    }))
    more = results.more
  }
  return userProposals
}
