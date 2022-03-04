import axios from 'axios'
// import response from './response'
class ElasticSearch {
  async search (search, params) {
    let responseElastic
    const data = params.filter.queries.length > 0
      ? this.getQueryFilter(search, params)
      : this.getQuery(search, params)
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

  getQuery (search, params) {
    return {
      from: params.from,
      size: params.size,
      query: {
        multi_match: {
          query: search,
          fuzziness: params.fuzziness,
          fields: params.fields
        }
      }
    }
  }

  getQueryFilter (search, params) {
    let _query = ''
    params.filter.queries.forEach((item, index) => {
      _query += item
      if (index !== params.filter.queries.length - 1) {
        _query += ' OR '
      }
    })
    return {
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
          filter: {
            multi_match: {
              query: _query,
              fields: params.filter.fields
            }
          }
        }
      },
      sort: [{
        createdDate: {
          order: 'desc'
        }
      }]

    }
  }
}

export default new ElasticSearch()
