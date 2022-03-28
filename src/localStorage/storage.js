class Storage {
  constructor ({ key }) {
    this.localKey = key
    const localObject = localStorage.getItem(key)
    // console.log('localObject', localObject, this.localKey)
    if (localObject) {
      // console.log('Existe el objeto')
      this._fromLocalStorage()
    } else {
      // console.log('Se creara uno nuevo')
      this._cleanLocalStorage()
    }
  }

  _saveOnLocalStorage () {
    localStorage.setItem(
      this.localKey,
      JSON.stringify(Array.from(this.value.entries()))
    )
  }

  _fromLocalStorage () {
    // this.value = localStorage.getItem(this.localKey)
    this.value = new Map(JSON.parse(localStorage.getItem(this.localKey)))
    // this.value = JSON.parse(localStorage.getItem(this.localKey))
  }

  _cleanLocalStorage () {
    this.value = new Map()
    this._saveOnLocalStorage()
  }

  addEntry (entry, value) {
    this.value.set(entry, value)
    this._saveOnLocalStorage()
  }

  getEntry (key) {
    return this.value.get(key)
  }

  removeEntry (key) {
    this.value.delete(key)
    this._saveOnLocalStorage()
  }

  getAll () {
    return this.value
  }

  _hasKey ({ workspaceId, objectId }) {
    return this.tokens.find((token) => {
      return token.workspaceId === workspaceId && token.objectId === objectId
    })
  }

  getTokens () {
    return this.tokens
  }
}

export default Storage
