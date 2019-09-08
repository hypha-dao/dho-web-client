export const connect = (state, payload) => {
  state.isConnected = true
}

export const disconnect = (state, payload) => {
  state.isConnected = false
}

export const login = (state, payload) => {
  state.accountName = payload.accountName
}

export const logout = (state, payload) => {
  state.accountName = null
}

export const startTransaction = (state, payload) => {
  state.isTransactionSending = true
  state.lastTransactionMessage = payload
  state.lastTransactionHash = ''
  state.lastTransactionError = ''
}

export const finishTransaction = (state, payload) => {
  state.isTransactionSending = false
  state.lastTransactionHash = payload
}

export const catchTransaction = (state, payload) => {
  state.isTransactionSending = false
  state.lastTransactionError = payload
}

export const catchError = (state, payload) => {
  state.lastCatchedError = payload
}
