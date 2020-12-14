export const roles = ({ roles }) => roles
export const rolesOptions = ({ list }) => list.data.map(
  r => ({
    value: r.role_id,
    label: r.title
  }))
export const proposals = ({ proposals }) => proposals
