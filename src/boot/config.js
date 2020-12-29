export default async ({ Vue, store }) => {
  const contracts = {
    dao: process.env.DAO_CONTRACT,
    decide: null,
    hyphaToken: null,
    seedsToken: null,
    seedsEscrow: null,
    tlostoSeeds: process.env.TLOSTO_SEEDS
  }

  // Debug purpose
  const all = `{
  documents(func: has(hash)) {
    expand(_all_) {
      expand(_all_){
        expand(_all_)
      }
    }
  }
}`
  const allDocuments = await store.$dgraph.newTxn().query(all)
  console.log(allDocuments)
  const query = `
    {
      var(func: has(document)) {
        documents as document @cascade{
          content_groups {
            contents  @filter(eq(type,"name") and eq(label, "root_node")){
              label
              type
            }
          }
        }
      }
      documents(func: uid(documents)) {
        expand(_all_) {
          expand(_all_){
            expand(_all_) {
              expand(_all_)
            }
          }
        }
      }
    }
  `
  const root = await store.$dgraph.newTxn().query(query)
  let settings
  root.data.documents[0] && root.data.documents[0].settings[0].content_groups.forEach(cg => {
    if (cg.contents.some(c => c.label === 'content_group_label' && c.value === 'settings')) {
      settings = cg.contents
    }
  })

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
  /*
  const queryPeriods = `
    {
      var(func: has(document)) {
        documents as document @cascade{
          content_groups {
            contents  @filter(eq(value,"period") and eq(type, "name")){
              label
              type
            }
          }
        }
      }
      documents(func: uid(documents)) {
        hash
        creator
        created_date
        content_groups {
          expand(_all_) {
            expand(_all_)
          }
        }
      }
    }
  `
  const periodDocuments = await store.$dgraph.newTxn().query(queryPeriods)
  console.log(periodDocuments)
  */
  // TODO don't use all the docs
  if (allDocuments) {
    const periods = []
    allDocuments.data.documents.filter(d => d.content_groups[0].contents.some(c => c.value === 'period' && c.type === 'name') || d.content_groups[0].contents.some(c => c.value === 'period' && c.type === 'name')).forEach(p => {
      let contents
      p.content_groups.forEach(cg => {
        if (cg.contents.some(c => c.label === 'content_group_label' && c.value === 'details')) {
          contents = cg.contents
        }
      })
      if (contents) {
        periods.push({
          value: p.hash,
          label: `${new Date(contents.find(o => o.label === 'start_time').value.slice(0, -4) + 'Z').toDateString()}`,
          phase: contents.find(o => o.label === 'label').value,
          startDate: new Date(contents.find(o => o.label === 'start_time').value.slice(0, -4) + 'Z'),
          endDate: new Date()
        })
        if (periods.length > 1) {
          periods[periods.length - 2].endDate = periods[periods.length - 1].startDate
        }
      }
    })

    periods.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    store.commit('periods/setPeriods', periods)
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
