
export default async ({ Vue, store }) => {
  try {
    const contracts = {
      dao: process.env.DAO_CONTRACT,
      decide: null,
      hyphaToken: process.env.HYPHA_TOKEN_CONTRACT,
      seedsToken: null,
      seedsEscrow: null,
      tlostoSeeds: process.env.TLOSTO_SEEDS
    }

    // Debug purpose
    /*
    const all = `{
      documents(func: has(hash)) {
        expand(_all_) {
          expand(_all_) {
            expand(_all_)
          }
        }
      }
    }`

    const allDocuments = await store.$dgraph.newTxn().query(all)
    */
    const query = `
      query document($hash:string) {
        document(func: eq(hash, $hash)) {
          uid
          hash
          settings {
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
    // debugger
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
      contracts.deferredHyphaToken = settings.find(o => o.label === 'hypha_cosale_contract').value
      contracts.hvoiceToken = settings.find(o => o.label === 'hvoice_token_contract').value
      contracts.hyphaMultiplier = parseInt(settings.find(o => o.label === 'hypha_deferral_factor_x100').value) / 100
      contracts.hyphaUsdValue = parseFloat(settings.find(o => o.label === 'hypha_usd_value').value)
      contracts.husdToken = settings.find(o => o.label === 'husd_token_contract').value
      contracts.seedsToken = settings.find(o => o.label === 'seeds_token_contract').value
      contracts.seedsEscrow = settings.find(o => o.label === 'seeds_escrow_contract').value
      contracts.seedsMultiplier = parseInt(settings.find(o => o.label === 'seeds_deferral_factor_x100').value) / 100
      contracts.treasury = settings.find(o => o.label === 'treasury_contract').value
      contracts.voteDurationSeconds = parseInt(settings.find(o => o.label === 'voting_duration_sec').value)
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
      dho: root.data.document[0].uid,
      contracts
    }
  } catch (e) {
    store.$error = e
  }
}
