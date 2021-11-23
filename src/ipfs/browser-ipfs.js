import BaseIpfs from './base-ipfs'

class BrowserIpfs extends BaseIpfs {
  async store (payload) {
    if (payload instanceof File) {
      const cid = await this.addFile(payload)
      return this.getTypeCid(cid, payload.type)
    }
    return super.store(payload)
  }

  /**
   * @param {String} cid
   * @param {String} type
   */
  async _retrieve (cid, type, extension) {
    const result = await super._retrieve(cid, type)
    if (result) {
      return result
    }
    const fileName = `${cid}.${extension}`
    return this.getFile(cid, fileName, type)
  }

  /**
   * @param {File} file to store
   * @returns {String} cid of the stored file
   */
  async addFile (file) {
    const data = new Uint8Array(await file.arrayBuffer())
    return this.add(data)
  }

  /**
   * @param {String} cid of the data that is wanted
   * @returns {File} file identified by the cid
   */
  async getFile (cid, name, type) {
    const data = await this.get(cid)
    return new File([data], name, {
      type
    })
  }
}

export default new BrowserIpfs()
