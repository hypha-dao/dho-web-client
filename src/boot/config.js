export default async ({ Vue, store }) => {
  try {
    const contracts = {
      dao: process.env.DAO_CONTRACT,
      decide: process.env.DECIDE_CONTRACT,
      hvoiceToken: process.env.HVOICE_TOKEN_CONTRACT,
      hypha: process.env.HYPHA_CONTRACT,
      hyphaToken: process.env.SUPPLY_CONTRACT,
      join: process.env.JOIN_CONTRACT,
      kv: process.env.KV_CONTRACT,
      seedsEscrow: process.env.SEEDS_ESCROW_CONTRACT,
      seedsToken: process.env.SEEDS_TOKEN_CONTRACT,
      tlostoSeeds: process.env.TLOSTO_SEEDS,
      deferredHyphaToken: process.env.DEFFERED_HYPHA_CONTRACT
    }
    Vue.prototype.$config = {
      contracts,
      rootDaoSlug: process.env.ROOT_DAO_SLUG || 'hypha'
    }

    store.$config = {
      dho: process.env.ROOT_DAO_ID,
      contracts
    }
  } catch (e) {
    store.$error = e
  }
}
