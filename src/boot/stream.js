import stream from 'getstream'
import { http } from './axios'

export default async ({ Vue, store }) => {
  const client = new StreamClient()
  Vue.prototype.$stream = client
  store['$stream'] = client
}

class StreamClient {
  constructor () {
    const client = stream.connect(process.env.STREAM_KEY, null, process.env.STREAM_APP_ID)
    const proposals = client.feed('proposals', 'common', process.env.STREAM_FEED_TOKEN_PROPOSALS)
    const members = client.feed('members', 'common', process.env.STREAM_FEED_TOKEN_MEMBERS)
    const roles = client.feed('roles', 'common', process.env.STREAM_FEED_TOKEN_ROLES)
    this.key = process.env.STREAM_KEY
    this.appId = process.env.STREAM_APP_ID
    this.client = client
    this.feeds = {
      proposals,
      members,
      roles
    }
    this.user = null
    this.accountName = ''
  }

  async login (accountName) {
    const { token } = await http.post('/login', { accountName })
    this.client = stream.connect(this.key, token, this.appId)
    this.user = this.client.user(accountName)
    this.accountName = accountName
    this.feeds.proposals = this.client.feed('proposals', 'common') // TODO needed ?
    return this.getUser()
  }

  getProposals () {
    return this.feeds.proposals.get({
      reactions: { recent: true, counts: true, own: true }
    })
  }

  getRoles () {
    return this.feeds.roles.get({
      reactions: { recent: true, counts: true, own: true }
    })
  }

  getMembers () {
    return this.feeds.members.get({
      enrich: true,
      reactions: { recent: true, counts: true, own: true }
    })
  }

  getUser () {
    return this.user.getOrCreate({ accountName: this.accountName })
  }

  async updateUser (data) {
    const user = await this.user.get(this.accountName)
    return this.user.update({
      ...user.data,
      ...data
    })
  }

  async uploadAvatar (file) {
    const { file: imageURL } = await this.client.images.upload(file)
    const { file: processedURL } = await this.client.images.process(imageURL, { h: 40, w: 40, resize: 'crop' })
    return processedURL
  }
}
