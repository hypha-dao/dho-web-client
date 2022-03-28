import camelToSnakeCase from '~/utils/camelToSnakeCase'

export const updateSettings = async function (context, { docId, data }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'setdaosetting',
    data: {
      dao_id: docId,
      kvs: Object.keys(data).map(key => {
        const valueTypes = {
          // _s for string
          // _i for int64
          // _n for name
          // _t for time_point
          // _a for asset

          number: 'int64',
          string: 'string'
        }

        const value = data[key]
        const type = valueTypes[typeof value]

        return {
          key: camelToSnakeCase(key),
          value: [type, value]
        }
      })
    }
  }]

  return this.$api.signTransaction(actions)
}
