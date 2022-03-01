import axios from 'axios'
// import response from './response'
class ElasticSearch {
  async search (search) {
    const params = {
      from: 0,
      size: 100,
      fields: ['*'],
      fuzziness: 'auto',
      endpoint: 'https://hypha.es.eu-west-1.aws.found.io:9243/dho-testnet-documents/_search',
      apikey: 'ZE0ybXQzNEJKUWhHaGFXUEtzblM6WWJxUHJ6NmZUVWVWVjVBMzFGN3JzQQ=='
    }
    console.log(search)
    let responseElastic
    const data = JSON.stringify({
      from: params.from,
      size: params.size,
      query: {
        multi_match: {
          query: search,
          fuzziness: params.fuzziness,
          fields: params.fields
        }
      },
      highlight: {
        fields: {
          '*': {}
        }
      }
    })
    const config = {
      method: 'post',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': '*',
        Authorization: `ApiKey ${params.apikey}`,
        'Content-Type': 'application/json'
      },
      mode: 'no-cors',
      withCredentials: true,
      credentials: 'same-origin',
      data: data
    }
    try {
      responseElastic = await axios.post(params.endpoint, data, config)
      return responseElastic.data
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default new ElasticSearch()
