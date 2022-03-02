import axios from 'axios'
// import response from './response'
class ElasticSearch {
  async search (search, params) {
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
}

export default new ElasticSearch()
