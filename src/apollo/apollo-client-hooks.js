import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { TokenRefreshLink } from 'apollo-link-token-refresh' // import TokenRefreshLink
import { jwtDecode } from 'jwt-decode'

const hyphaAccessTokenKey = 'hyphaAccessToken'
const hyphaRefreshTokenKey = 'hyphaRefreshToken'

const tokenRefreshLink = new TokenRefreshLink({
  isTokenValidOrUndefined: () => {
    const token = localStorage.getItem(hyphaAccessTokenKey)
    if (!token) return false // if no token, assume it's valid

    try {
      const { exp } = jwtDecode(token)

      return Date.now() < exp * 1000
    } catch {
      return false
    }
  },
  fetchAccessToken: () => {
    const HYPHA_AUTH_URL = process.env.HYPHA_AUTH_URL
    const CHAIN_NAME = process.env.CHAIN_NAME
    const ENV = process.env.ENV || 'prod'
    const network = process.env.IS_TESTNET ? 'testnet' : 'mainnet'
    const url = `${HYPHA_AUTH_URL}?chain=${CHAIN_NAME}&env=${ENV}&network=${network}`

    return fetch(url, {
      method: 'GET'
    })
  },
  handleFetch: (accessToken) => {
    localStorage.setItem(hyphaAccessTokenKey, accessToken)
  },
  handleResponse: (operation, accessTokenField) => async (response) => {
    const data = await response.json()

    localStorage.setItem(hyphaAccessTokenKey, data.accessJWT)
    localStorage.setItem(hyphaRefreshTokenKey, data.refreshJWT)

    return response
  },
  handleError: (err) => {
    // Handle token refresh errors (e.g., logout user)
    if (err) {
      localStorage.removeItem(hyphaRefreshTokenKey)
    }
  }
})

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_URI || 'https://alpha-stt.tekit.io/graphql',
  fetch: (uri, options) => {
    const accessToken = localStorage.getItem(hyphaAccessTokenKey) // get the access token from storage
    options.headers['X-Dgraph-AccessToken'] = accessToken
    return fetch(uri, options)
  }
})

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri:
    process.env.GRAPHQL_URI.replace('https', 'wss') ||
    'wss://alpha-stts.tekit.io/graphql',
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
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  tokenRefreshLink.concat(httpLink)
)

export async function apolloClientBeforeCreate({
  apolloClientConfigObj,
  app,
  router,
  store,
  ssrContext,
  urlPath,
  redirect
}) {
  // if needed you can modify here the config object used for apollo client
  // instantiation
  apolloClientConfigObj.link = link
}

export async function apolloClientAfterCreate(
  {
    apolloClient,
    store
  } /* { apolloClient, app, router, store, ssrContext, urlPath, redirect } */
) {
  // if needed you can modify here the created apollo client
  store.$apollo = apolloClient
}
