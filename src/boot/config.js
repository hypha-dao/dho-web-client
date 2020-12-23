export default async ({ Vue, store }) => {
  const contracts = {
    dao: process.env.DAO_CONTRACT,
    decide: null,
    hyphaToken: null,
    seedsToken: null,
    seedsEscrow: null,
    tlostoSeeds: process.env.TLOSTO_SEEDS
  }
  console.log(contracts.tlostoSeeds)
  const result = await store.$api.getTableRows({
    code: process.env.DAO_CONTRACT,
    scope: process.env.DAO_CONTRACT,
    table: 'config'
  })
  if (result && result.rows.length) {
    contracts.decide = result.rows[0].names.find(o => o.key === 'telos_decide_contract').value
    contracts.hyphaToken = result.rows[0].names.find(o => o.key === 'hypha_token_contract').value
    contracts.hyphaMultiplier = result.rows[0].ints.find(o => o.key === 'hypha_deferral_factor_x100').value / 100
    contracts.husdToken = result.rows[0].names.find(o => o.key === 'husd_token_contract').value
    contracts.seedsToken = result.rows[0].names.find(o => o.key === 'seeds_token_contract').value
    contracts.seedsEscrow = result.rows[0].names.find(o => o.key === 'seeds_escrow_contract').value
    contracts.seedsMultiplier = result.rows[0].ints.find(o => o.key === 'seeds_deferral_factor_x100').value / 100
    contracts.treasury = result.rows[0].names.find(o => o.key === 'treasury_contract').value
  }

  const seedsConfig = await store.$api.getTableRows({
    code: 'tlosto.seeds',
    scope: 'tlosto.seeds',
    table: 'config'
  })
  if (seedsConfig && seedsConfig.rows.length) {
    const usdToSeeds = parseFloat(seedsConfig.rows[0].seeds_per_usd)
    const seedsToUsd = 1 / usdToSeeds
    store.commit('payouts/setSeedsValues', { usdToSeeds, seedsToUsd }, { root: true })
  }

  Vue.prototype.$config = { contracts }
  store['$config'] = {
    contracts
  }
}
