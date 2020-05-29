export const addPayments = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.list.data.length ? rows.slice(1) : rows
    state.list.data = state.list.data.concat(arr)
  }
  state.list.loaded = !more
}

export const addOpenRedemptions = (state, { rows }) => {
  if (rows.length) {
    state.list.data = state.list.data.concat(rows.map(r => ({
      type: 'redemption',
      memo: 'Opened redemption',
      recipient: r.redeemer,
      amount: r.amount,
      status: 'open'
    })))
  }
}

export const clearData = (state) => {
  state.list.data = []
  state.list.loaded = false
}

export const clearRedemptions = (state) => {
  state.list.data = state.list.data.filter(d => d.type !== 'redemption')
}
