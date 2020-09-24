export const getSupply = async function () {
  const tokens = {
    husd: 0,
    hypha: 0,
    seeds: 0
  }

  let result = await this.$api.getTableRows({
    code: this.$config.contracts.husdToken,
    scope: 'HUSD',
    table: 'stat',
    limit: 1
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows[0]
    if (row) {
      tokens.husd = parseFloat(row.supply)
    }
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.hyphaToken,
    scope: 'HYPHA',
    table: 'stat',
    limit: 1
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows[0]
    if (row) {
      tokens.hypha = parseFloat(row.supply)
    }
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.seedsToken,
    scope: 'SEEDS',
    table: 'stat',
    limit: 1
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows[0]
    if (row) {
      tokens.seeds = parseFloat(row.supply)
    }
  }

  return tokens
}
