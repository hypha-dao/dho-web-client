export default async ({ store }) => {
  const contracts = {
    dao: process.env.DAO_CONTRACT,
    decide: null,
    hyphaToken: null,
    seedsToken: null,
    seedsEscrow: null
  }
  const result = await store.$api.getTableRows({
    code: process.env.DAO_CONTRACT,
    scope: process.env.DAO_CONTRACT,
    table: 'config'
  })
  if (result && result.rows.length) {
    contracts.decide = result.rows[0].names.find(o => o.key === 'telos_decide_contract').value
    contracts.hyphaToken = result.rows[0].names.find(o => o.key === 'hypha_token_contract').value
    contracts.seedsToken = result.rows[0].names.find(o => o.key === 'seeds_token_contract').value
    contracts.seedsEscrow = result.rows[0].names.find(o => o.key === 'seeds_escrow_contract').value
  }

  store['$config'] = {
    contracts
  }
}
