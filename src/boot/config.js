
export default async ({ Vue, store }) => {
  try {
    const contracts = {
      dao: process.env.DAO_CONTRACT,
      decide: null,
      hyphaToken: null,
      seedsToken: null,
      seedsEscrow: null,
      tlostoSeeds: process.env.TLOSTO_SEEDS
    }

    // Debug purpose
    /*
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
    */
    const query = `
      query document($hash:string){
        document(func: eq(hash, $hash)) {
          hash
          settings {
            expand(_all_){
              expand(_all_) {
                expand(_all_)
              }
            }
          }
          content_groups{
            expand(_all_){
              expand(_all_)
            }
          }
        }
      }
    `
    const root = await store.$dgraph.newTxn().queryWithVars(query, { $hash: `${process.env.DGRAPH_ROOT_HASH}` })
    let settings
    if (root) {
      root.data.document[0] && root.data.document[0].settings[0].content_groups.forEach(cg => {
        if (cg.contents.some(c => c.label === 'content_group_label' && c.value === 'settings')) {
          settings = cg.contents
        }
      })
    }
    if (settings) {
      contracts.decide = settings.find(o => o.label === 'telos_decide_contract').value
      contracts.hyphaToken = settings.find(o => o.label === 'hypha_token_contract').value
      contracts.hvoiceToken = settings.find(o => o.label === 'hvoice_token_contract').value
      contracts.hyphaMultiplier = parseInt(settings.find(o => o.label === 'hypha_deferral_factor_x100').value) / 100
      contracts.husdToken = settings.find(o => o.label === 'husd_token_contract').value
      contracts.seedsToken = settings.find(o => o.label === 'seeds_token_contract').value
      contracts.seedsEscrow = settings.find(o => o.label === 'seeds_escrow_contract').value
      contracts.seedsMultiplier = parseInt(settings.find(o => o.label === 'seeds_deferral_factor_x100').value) / 100
      contracts.treasury = settings.find(o => o.label === 'treasury_contract').value
      contracts.voteDurationSeconds = parseInt(settings.find(o => o.label === 'voting_duration_sec').value)
    }

    const queryPeriods = `
      {
        documents as var(func: type(Document))@cascade{
          hash
          content_groups {
            contents  @filter(eq(value,"period") and eq(type, "name")){
              label
              type
            }
          }
        }
        documents(func: uid(documents)) {
          hash
          content_groups {
              expand(_all_) {
              expand(_all_)
            }
          }
        }
      }
    `
    const periodDocuments = await store.$dgraph.newTxn().query(queryPeriods)

    if (periodDocuments) {
      const periods = []
      periodDocuments.data.documents.filter(d => d.content_groups[0].contents.some(c => c.value === 'period') || d.content_groups[1].contents.some(c => c.value === 'period')).forEach(p => {
        let contents
        p.content_groups.forEach(cg => {
          if (cg.contents.some(c => c.label === 'content_group_label' && c.value === 'details')) {
            contents = cg.contents
          }
        })
        if (contents) {
          periods.push({
            value: p.hash,
            label: `${new Date(contents.find(o => o.label === 'start_time').value + 'Z').toDateString()}`,
            phase: contents.find(o => o.label === 'label').value,
            startDate: new Date(contents.find(o => o.label === 'start_time').value + 'Z'),
            endDate: null
          })

          // TODO: Should we sort these periods before setting endDate?
          if (periods.length > 1) {
            periods[periods.length - 2].endDate = periods[periods.length - 1].startDate
          }
        }
      })

      periods.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      for (let i = 0; i < periods.length - 1; i += 1) {
        periods[i].endDate = periods[i + 1].startDate
      }

      // Trash the final period since we don't know when it ends
      periods.pop()

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
    store.$config = {
      contracts
    }
  } catch (e) {
    store.$error = e
  }
}
