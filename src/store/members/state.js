export default () => ({
  registered: false,
  list: {
    data: [],
    loaded: false,
    pagination: {
      limit: 100 // limit - 1 as the first item is duplicated from the lower_bound
    }
  }
})
