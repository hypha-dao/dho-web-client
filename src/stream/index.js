import stream from 'getstream'

let commonClient = stream.connect(process.env.STREAM_KEY, null, process.env.STREAM_APP_ID)
let userClient = null
let userActor = null

let proposalsFeed = commonClient.feed('proposals', 'common', process.env.STREAM_FEED_TOKEN_PROPOSALS)
let membersFeed = commonClient.feed('members', 'common', process.env.STREAM_FEED_TOKEN_MEMBERS)
let rolesFeed = commonClient.feed('roles', 'common', process.env.STREAM_FEED_TOKEN_ROLES)

const login = async (accountName) => {
  const response = await fetch(`${process.env.WEBSERVICE}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ accountName })
  })

  const { token } = await response.json()

  userClient = stream.connect(process.env.STREAM_KEY, token, process.env.STREAM_APP_ID)
  userActor = userClient.user(accountName)
  proposalsFeed = userClient.feed('proposals', 'common', proposalsFeed)
}

const getActivities = () => {
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

  return userActor.getOrCreate({ accountName })
}

const getUsers = () => {
  return membersFeed.get({
    enrich: true,
    reactions: { recent: true, counts: true, own: true }
  })
}

const uploadAvatar = async (file) => {
  const { file: imageURL } = await userClient.images.upload(file)
  const { file: processedURL } = await userClient.images.process(imageURL, { h: 40, w: 40, resize: 'crop' })
  console.log(processedURL)
  return processedURL
}

const updateUser = async (data) => {
  const { accountName } = data

  const user = await userActor.get(accountName)

  return userActor.update({
    ...user.data,
    ...data
  })
}

export default {
  getActivities,
  getRoles,
  getUser,
  getUsers,
  uploadAvatar,
  updateUser
}
