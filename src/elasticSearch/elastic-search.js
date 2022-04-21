import axios from 'axios'
import { date } from 'quasar'
class ElasticSearch {
  async search (search, params, type) {
    let responseElastic
    let data

    switch (type) {
      case 'time':
        data = this.getQueryByTypeAndTime(search, params)
        break
      default:
        data = this.getQueryFilter(search, params)
        break
    }
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
    const _queryStates = this.createQueryWithOr(params.filter.states)

    const obj = {
      from: params.from,
      size: params.size,
      query: {
        bool: {
          must: {
            multi_match: {
              query: search,
              type: 'bool_prefix',
              fields: params.fields
            }
          },
          filter: [
            {
              multi_match: {
                query: _queryStates,
                type: 'bool_prefix',
                fields: ['details_state_s']
              }
            },
            {
              multi_match: {
                query: _query,
                fields: params.filter.fieldsDocType
              }

            },
            {
              multi_match: {
                query: _queryIds,
                fields: params.filter.fieldsBelongs
              }
            }
          ]
        }
      },
      highlight: {
        fields: {
          '*': {}
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

  getQueryByTypeAndTime (search, params) {
    const obj = {
      from: params.from,
      size: params.size,
      query: {
        bool: {
          must: {
            multi_match: {
              query: search,
              type: 'bool_prefix',
              fields: [
                'type'
              ]
            }
          },
          filter: [
            {
              multi_match: {
                query: params.filter.ids[0],
                fields: ['edges.dao']
              }

            },
            {
              range: {
                system_originalApprovedDate_t: {
                  lt: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SZ'),
                  gt: date.formatDate(date.subtractFromDate(new Date(), { days: 7 }), 'YYYY-MM-DDTHH:mm:ss.SZ')
                }
              }
            }
          ]
        }
      },
      highlight: {
        fields: {
          '*': {}
        }
      },
      sort: [{
        updatedDate: {
          order: 'desc'
        }
      }]

    }
    return obj
  }

  getQueryByType (search, params) {
    const _queryStates = this.createQueryWithOr(params.filter.states)
    const obj = {
      from: params.from,
      size: params.size,
      query: {
        bool: {
          must: {
            multi_match: {
              query: search,
              type: 'bool_prefix',
              fields: [
                'type'
              ]
            }
          },
          filter: [
            {
              multi_match: {
                query: _queryStates,
                type: 'bool_prefix',
                fields: ['details_state_s']
              }
            },
            {
              multi_match: {
                query: params.filter.ids[0],
                fields: ['edges.dao']
              }
            }
          ]
        }
      },
      highlight: {
        fields: {
          '*': {}
        }
      },
      sort: [{
        updatedDate: {
          order: 'desc'
        }
      }]
    }
    return obj
  }
}

export default new ElasticSearch()
