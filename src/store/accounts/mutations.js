import { MEMBER_TYPE } from '~/const'

export const setLoadingWallet = (state, wallet) => {
  state.loading = wallet
}

export const setAccount = (state, account) => {
  state.account = account
}

export const clearAccount = function (state) {
  localStorage.removeItem('autoLogin')
  localStorage.removeItem('isMember')
  localStorage.removeItem('memberType')
  state.account = null
  state.membership = false
  state.applicant = false
  state.enroller = false
  state.memberType = null
}

export const setMembership = (state, membership) => {
  state.membership = membership
}

export const setApplicant = (state, applicant) => {
  state.applicant = applicant
}

export const setEnroller = (state, enroller) => {
  state.enroller = enroller
}

export const setAdmin = (state, admin) => {
  state.admin = admin
}

export const setIsHyphaOwner = (state, isHyphaOwner) => {
  state.isHyphaOwner = isHyphaOwner
}

export const setMemberType = (state, memberType) => {
  state.memberType = memberType
}

export const setMember = (state, dao) => {
  const isApplicant = dao.applicant.length === 1
  const isMember = dao.member.length === 1
  const isAdmin = dao.admin.length === 1
  const isEnroller = dao.enroller.length === 1

  state.applicant = isApplicant
  state.membership = isMember
  state.admin = isAdmin
  state.enroller = isEnroller
  state.memberType = MEMBER_TYPE.CORE

  localStorage.setItem('isMember', isMember)
  localStorage.setItem('memberType', MEMBER_TYPE.CORE)
}
