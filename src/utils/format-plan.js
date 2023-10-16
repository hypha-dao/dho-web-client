import { PLAN, PLAN_STATUS } from '~/const'

export default (plan = {}) => ({
  ...plan,
  name: (plan?.name || PLAN.FOUNDER).toLowerCase(),
  status: plan?.status || PLAN_STATUS.ACTIVE,
  amountUSD: plan?.price / 100 / 12,
  coreMembersCount: plan?.coreMembersCount || 5,
  communityMembersCount: plan?.communityMembersCount || 0
})
