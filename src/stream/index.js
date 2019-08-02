import stream from 'getstream'

const serviceEndpoint = 'https://diadem.host/hypha'
const streamKey = 'skkd3tdbsjfk'
const streamAppId = 55737

let commonClient = stream.connect(streamKey, null, streamAppId)
let userClient = null

let proposalsFeed = commonClient.feed('proposals', 'common', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6InByb3Bvc2Fsc2NvbW1vbiJ9.ZyEuM0wlmq5yRJNQasqXK464Drbq7O4aKO9QlXjN8YE')
let membersFeed = commonClient.feed('members', 'common', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im1lbWJlcnNjb21tb24ifQ.SeQEGOdegqJ8aOaiHTITrpnoSyDEtl3m9Ye7iNL2I_c')
let rolesFeed = commonClient.feed('roles', 'common', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6InJvbGVzY29tbW9uIn0.mm11GGj8rn_aLfO-bJ3ThoGSL5Cnr35IgBEtsvpXXQ8')

const login = async (accountName) => {
  const response = await fetch(`${serviceEndpoint}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ accountName })
  })

  const { token } = await response.json()

  userClient = stream.connect(streamKey, token, streamAppId)
  proposalsFeed = userClient.feed('proposals', 'common')
}

const getActivities = () => {
  console.log('get proposals')

  return proposalsFeed.get({
    reactions: { recent: true, counts: true, own: true }
  })
}

const getRoles = () => {
  return rolesFeed.get({
    reactions: { recent: true, counts: true, own: true }
  })
}

const getUser = async (accountName) => {
  await login(accountName)

  return userClient.user(accountName).getOrCreate({ accountName })
}

const getUsers = () => {
  return membersFeed.get({ enrich: true })
}

const uploadAvatar = async (file) => {
  const { file: imageURL } = await userClient.images.upload(file)
  const { file: processedURL } = await userClient.images.process(imageURL, { h: 40, w: 40, resize: 'crop' })
  console.log(processedURL)
  return processedURL
}

export default {
  getActivities,
  getRoles,
  getUser,
  getUsers,
  uploadAvatar
}
