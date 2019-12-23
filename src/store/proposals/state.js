export default () => ({
  list: {
    assignments: { data: [], loaded: false },
    payouts: { data: [], loaded: false },
    roles: { data: [], loaded: false },
    loaded: false,
    pagination: {
      limit: 100 // limit - 1 as the first item is duplicated from the lower_bound
    }
  },
  view: {
    proposal: null
  }
})
