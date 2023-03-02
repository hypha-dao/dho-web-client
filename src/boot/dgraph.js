import { DgraphClient, DgraphClientStub } from 'dgraph-js-http'

/**
 * Generates vars for a dgraph query in the expected format
 * Example output: { $key1: value1, $key2: value2 }
 */
function buildVars (item, parameters) {
  const vars = {}
  if (item.parameters && parameters) {
    Object.keys(item.parameters).forEach(key => {
      vars[`$${key}`] = `${parameters[key]}`
    })
  }

  return vars
}

export default ({ Vue, store }) => {
  // Defines the query 'routes' that our app uses
  // The query can be written in a graphql file or inline
  // The provided 'name' must match the query name from graphql
  const QUERIES = {
    '/profile/get': {
      name: 'profile',
      query: require('../query/profile/profile.graphql').default,
      parameters: {
        username: String
      },
      single: true
    }
  }

  const client = new DgraphClient(new DgraphClientStub(process.env.DGRAPH_URL, false))

  function convertContentGroups (data) {
    const result = {}

    if (data) {
      // Transform content_groups to sub objects
      if (Array.isArray(data.content_groups)) {
        data.content_groups.forEach(group => {
          if (Array.isArray(group.contents)) {
            const groupName = group.contents.find(c => c.label === 'content_group_label').value
            data[groupName] = {}
            group.contents.forEach(c => {
              if (c.label === 'content_group_label') return
              let value = c.value
              switch (c.type) {
                case 'int64': value = Number.parseInt(c.value); break
                case 'float': value = Number.parseInt(c.value); break
                case 'asset': break
                case 'time_point': value = new Date(c.value); break
              }
              data[groupName][c.label] = value
            })
          }
        })
      }
      // Retrieve values from data object, ignoring content_groups
      Object.keys(data).forEach(key => {
        if (key === 'content_groups') return
        if (Array.isArray(data[key])) {
          const items = []
          data[key].forEach(item => items.push(convertContentGroups(item)))
          result[key] = items
        } else {
          result[key] = data[key]
        }
      })
    }

    return result
  }

  async function dgraphQuery (item, parameters) {
    const res = await client.newTxn({ readOnly: true, bestEffort: true })
      .queryWithVars(item.query, buildVars(item, parameters))
    if (item.single) {
      const data = res.data[item.name][0]
      return convertContentGroups(data)
    }

    if (Array.isArray(res.data[item.name])) {
      const results = []
      res.data[item.name].forEach(r => {
        results.push(convertContentGroups(r))
      })

      return results
    }

    // TODO: Throw exception?
    return null
  }

  // TODO: Remove this, used by legacy dgraph queries
  store.$dgraph = client

  /**
    * Run a dgraph query and extract the results into a plain javascript object
    * TODO: Transform content_groups and contents to simple properties of proper type
    * TODO: Cache the result of this query and return that immediately for subsequent calls
    * TODO: If same query is in flight recently (<2 seconds) return results of the first call
    * @param {String} path Query route to use (unique identifier)
    * @param {Object} parameters Object with parameters for query
    */
  Vue.prototype.$dgraphQuery = async (path, parameters) => {
    const item = QUERIES[path]
    if (item) {
      return await dgraphQuery(item, parameters)
    }

    return null
  }
}
