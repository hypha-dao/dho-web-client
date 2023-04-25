import { DgraphClient, DgraphClientStub } from 'dgraph-js-http'

export default ({ Vue, store }) => {
  const client = new DgraphClient(new DgraphClientStub(process.env.DGRAPH_URL, false))

  if (process.env.DGRAPH_AUTH_KEY) {
    client.setCloudApiKey(process.env.DGRAPH_AUTH_KEY)
  }

  // TODO: Remove this, used by legacy dgraph queries
  store.$dgraph = client
}
