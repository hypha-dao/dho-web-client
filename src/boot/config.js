
export default async ({ Vue, store }) => {
  try {
    const contracts = {
      dao: process.env.DAO_CONTRACT,
      decide: null,
      hyphaToken: process.env.SUPPLY_CONTRACT,
      hypha: process.env.HYPHA_CONTRACT,
      seedsToken: null,
      seedsEscrow: null,
      tlostoSeeds: process.env.TLOSTO_SEEDS,
      kv: process.env.KV_CONTRACT
    }

    Vue.prototype.$config = { contracts }
    store.$config = {
      dho: process.env.ROOT_DAO_ID,
      rootDaoSlug: process.env.ROOT_DAO_SLUG || 'hypha',
      contracts
    }
  } catch (e) {
    store.$error = e
  }
}
