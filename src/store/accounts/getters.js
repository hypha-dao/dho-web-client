
export const account = ({ account }) => account
export const isAdmin = ({ admin }) => admin
export const isApplicant = ({ applicant }) => applicant
export const isAuthenticated = ({ account }) => account !== null
export const isEnroller = ({ enroller }) => enroller
export const isHyphaOwner = ({ isHyphaOwner }) => isHyphaOwner
export const isMember = ({ membership }) => membership
export const isProduction = () => process.env.NODE_ENV === 'production'
export const loading = ({ loading }) => loading
