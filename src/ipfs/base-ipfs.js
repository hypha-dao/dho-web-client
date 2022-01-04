// import IpfsClient from 'nano-ipfs-store'
import { create } from 'ipfs-http-client'
import mime from 'mime-types'

class BaseIpfs {
  constructor () {
    // this.client = IpfsClient.at(process.env.IPFS_URL)
    const auth = 'Basic ' + Buffer.from(process.env.IPFS_PROJECT_ID + ':' + process.env.IPFS_PROJECT_SECRET).toString('base64')
    console.log('auth', auth)
    this.client = create({
      host: process.env.IPFS_URL,
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth
      }
    })
    // console.log('client ipfs', this.client)
  }

  async store (payload) {
    const cid = await this.addAsJson(payload)
    return this.getTypeCid(cid, 'json')
  }

  /**
   *
   * @param {String} typeCid
   */
  async retrieve (typeCid) {
    const { cid, type, extension } = this.parseTypeCid(typeCid)
    const payload = await this._retrieve(cid, type, extension)
    if (!payload) {
      throw new Error(`No handler for type: ${type}`)
    }
    return {
      type,
      extension,
      payload
    }
  }

  /**
   * @param {String} cid
   * @param {String} type
   */
  async _retrieve (cid, type, extension) {
    if (extension === 'json') {
      return this.getFromJson(cid)
    }
    return null
  }

  /**
   * @param {*} data to store, the data will be JSON stringified
   * before storing
   * @returns {String} cid of the stored data
   */
  async addAsJson (data) {
    const json = JSON.stringify(data)
    return this.add(json)
  }

  /**
   * @param {String} cid of the data that is wanted
   * @returns {*} JSON parsed data identified by the cid
   */
  async getFromJson (cid) {
    const data = await this.cat(cid)
    return JSON.parse(data)
  }

  /**
   * @param {String or Uint8Array} data to store
   * @returns {String} cid of the stored data
   */
  async add (data) {
    return this.client.add(data)
  }

  /**
   * @param {String} cid of the data that is wanted
   * @returns {String} data identified by the cid
   */
  async cat (cid) {
    return this.client.cat(cid)
  }

  /**
   * @param {String} cid of the data that is wanted
   * @returns {Uint8Array} data identified by the cid
   */
  async get (cid) {
    return this.client.get(cid)
    // const cids = new CID(cid)
    // return cids.toV1().toBaseEncodedString('base32')
  }

  /**
   *
   * @param {String} cid
   * @param {String} extensionType extension or content type
   */
  getTypeCid (cid, extensionType) {
    const extension = extensionType.indexOf('/') > -1 ? mime.extension(extensionType) : extensionType
    return `${cid}:${extension}`
  }

  /**
   *
   * @param {String} typeCid
   */
  parseTypeCid (typeCid) {
    const [cid, extension] = typeCid.split(':')
    return {
      cid,
      extension,
      type: mime.lookup(extension)
    }
  }
}

export default BaseIpfs
