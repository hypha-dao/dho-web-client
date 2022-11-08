import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: process.env.GRAPHQL_URI || 'https://alpha-stt.tekit.io/graphql'
})

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: process.env.GRAPHQL_URI.replace('https', 'wss') || 'wss://alpha-stts.tekit.io/graphql',
  options: {
    reconnect: true
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

export async function apolloClientBeforeCreate ({ apolloClientConfigObj, app, router, store, ssrContext, urlPath, redirect }) {
  // if needed you can modify here the config object used for apollo client
  // instantiation
  apolloClientConfigObj.link = link
}

export async function apolloClientAfterCreate ({ apolloClient, store }/* { apolloClient, app, router, store, ssrContext, urlPath, redirect } */) {
  // if needed you can modify here the created apollo client
  store.$apollo = apolloClient
}
