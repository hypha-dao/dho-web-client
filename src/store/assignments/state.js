export default () => ({
  list: {
    assignments: { data: [], loaded: false },
    proposals: { data: [], loaded: false },
    data: [],
    loaded: false,
    pagination: {
      limit: 100 // limit - 1 as the first item is duplicated from the lower_bound
    }
  },
  view: null
})
