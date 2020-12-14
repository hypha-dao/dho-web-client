export default async ({ Vue, store }) => {
  const contracts = {
    dao: process.env.DAO_CONTRACT,
    decide: null,
    hyphaToken: null,
    seedsToken: null,
    seedsEscrow: null
  }

  const query = `
    query documents($hash:string){
      documents(func: eq(hash, $hash)) {
        expand(_all_){
          expand(_all_){
            expand(_all_) {
              expand(_all_)
            }
          }
        }
      }
    }
  `
  const root = await store.$dgraph.newTxn().queryWithVars(query, { $hash: `${process.env.DGRAPH_ROOT}`.toUpperCase() })
  const settings = root.data.documents[0].settings[0].content_groups[0].contents

  if (settings) {
    contracts.decide = settings.find(o => o.label === 'telos_decide_contract').value
    contracts.hyphaToken = settings.find(o => o.label === 'hypha_token_contract').value
    contracts.hyphaMultiplier = parseInt(settings.find(o => o.label === 'hypha_deferral_factor_x100').value) / 100
    contracts.husdToken = settings.find(o => o.label === 'husd_token_contract').value
    contracts.seedsToken = settings.find(o => o.label === 'seeds_token_contract').value
    contracts.seedsEscrow = settings.find(o => o.label === 'seeds_escrow_contract').value
    contracts.seedsMultiplier = parseInt(settings.find(o => o.label === 'seeds_deferral_factor_x100').value) / 100
    contracts.treasury = settings.find(o => o.label === 'treasury_contract').value
  }

  const periods = []
  root.data.documents[0].period.forEach(p => {
    periods.push({
      // value: p.content_groups[0].contents.find(o => o.label === 'id').value,
      label: `${new Date(p.content_groups[0].contents.find(o => o.label === 'start_time').value.slice(0, -4) + 'Z').toDateString()}`,
      phase: p.content_groups[0].contents.find(o => o.label === 'label').value,
      startDate: new Date(p.content_groups[0].contents.find(o => o.label === 'start_time').value.slice(0, -4) + 'Z'),
      endDate: new Date(p.content_groups[0].contents.find(o => o.label === 'end_time').value.slice(0, -4) + 'Z')
    })
  })

  periods.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  // store.commit('periods/setPeriods', periods)

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
