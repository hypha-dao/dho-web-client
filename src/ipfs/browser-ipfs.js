import BaseIpfs from './base-ipfs'

class BrowserIpfs extends BaseIpfs {
  async store (payload) {
    if (payload instanceof File) {
      const { path: cid } = await this.addFile(payload)
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
    // const data = await this.get(cid)
    const data = await this.createAndGetFile(cid)
    console.log('getFile', data)
    return new File([data], name, {
      type
    })
  }

  async createAndGetFile (cid, name, type) {
    return new Promise((resolve, reject) => {
      try {
        let blob = null
        const xhr = new XMLHttpRequest()
        xhr.open('GET', `https://ipfs.infura.io:5001/api/v0/cat?arg=${cid}`)
        xhr.responseType = 'blob'
        xhr.onload = function () {
          blob = xhr.response
          console.log('blob', blob)
          resolve(blob)
          // LoadAndDisplayFile(blob)
        }
        xhr.send()
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default new BrowserIpfs()
