export default () => ({
  roles: {
    items: [],
    loaded: false,
    limit: 20 // limit - 1 as the first item is duplicated from the lower_bound
  },
  roleProposals: {
    items: [],
    loaded: false,
    limit: 20 // limit - 1 as the first item is duplicated from the lower_bound
  },
  view: {
    role: null
  }
})
