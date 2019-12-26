export const role = ({ view }) => view
export const roles = ({ list }) => list.data
export const rolesLoaded = ({ list }) => list.loaded
export const rolesOptions = ({ list }) => list.data.map(
  r => ({
    value: r.role_id,
    label: r.title
  }))
