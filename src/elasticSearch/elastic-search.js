import axios from 'axios'
class ElasticSearch {
  async search (search, params) {
    let responseElastic
    const data = this.getQueryFilter(search, params)

    const config = {
      method: 'post',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': '*',
        Authorization: `ApiKey ${process.env.ELASTIC_SEARCH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      mode: 'no-cors',
      withCredentials: true,
      credentials: 'same-origin',
      data: data
    }
    try {
      responseElastic = await axios.post(process.env.ELASTIC_SEARCH_URL, data, config)
      return responseElastic.data
    } catch (e) {
      throw new Error(e)
    }
  }

  createQueryWithOr (array) {
    let _query = ''
    array.forEach((item, index) => {
      _query += item
      if (index !== array.length - 1) {
        _query += ' OR '
      }
    })
    return _query
  }

  getQueryFilter (search, params) {
    const _query = this.createQueryWithOr(params.filter.queries)
    const _queryIds = this.createQueryWithOr(params.filter.ids)
    const obj = {
      from: params.from,
      size: params.size,
      query: {
        bool: {
          must: {
            multi_match: {
              query: search,
              fuzziness: params.fuzziness,
              fields: params.fields
            }
          },
          filter: [
            {
              multi_match: {
                query: _query,
                fields: params.filter.fields
              }

            },
            {
              multi_match: {
                query: _queryIds,
                fields: ['docId']
              }
            }
          ]
        }
      },
      sort: [{
        createdDate: {
          order: 'desc'
        }
      }]

    }
    return obj
  }
}

export default new ElasticSearch()
