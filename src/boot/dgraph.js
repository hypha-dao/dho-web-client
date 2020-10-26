import { DgraphClient, DgraphClientStub } from 'dgraph-js-http'

export default ({ store }) => {
  const clientStub = new DgraphClientStub(
    process.env.DGRAPH_URL,
    false
  )

  store['$dgraph'] = new DgraphClient(clientStub)
}
