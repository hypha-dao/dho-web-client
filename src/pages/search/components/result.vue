<template lang="pug">
widget.bg-internal-bg.q-mb-sm
  .row.items-center.justify-between
    q-btn(v-if= "username === ''" round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
    profile-picture(v-else :username="username" size='28px')
    .q-ml-md.q-mr-auto.spacingInfo
      .h-h6 {{ header.length > maxChar ? header.substring(0,maxChar) + '...' : header }}
      .h-b3.grey-color {{ type !== 'Member' ? author : 'Member' }}
    chips(:tags="getTags")
</template>

<script>
import { format } from '~/mixins/format'

export default {
  name: 'result',
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    Chips: () => import('~/components/common/chips.vue')
  },
  mixins: [format],
  props: {
    username: {
      type: String,
      default: ''
    },
    creator: {
      type: String,
      default: ''
    },
    icon: String,
    title: String,
    type: String,
    salary: String,
    compensation: String,
    status: String,
    highlights: Object,
    applicant: Boolean,
    expirationDate: String
  },
  watch: {
    creator: {
      immediate: true,
      handler: async function () {
        this.creator.then((value) => { this.author = value })
        this.$forceUpdate()
      }
    },
    title: {
      immediate: true,
      handler: async function () {
        if (this.type === 'Member') {
          this.title.then(value => { this.header = value })
        } else {
          this.header = this.title
        }
        this.$forceUpdate()
      }
    }
  },
  computed: {
    getType () {
      /* eslint-disable no-multi-spaces */
      switch (this.type) {
        case 'Member':          return 'Member'
        case 'Assignbadge':     return 'Recurring Activity'
        case 'Assignment':      return 'Recurring Activity'
        case 'Role':            return 'Organizational'
        case 'Badge':           return 'Organizational Asset'
        case 'Payout':          return 'Generic Contribution'
        case 'Payment':         return 'Payment'
        default:                return ''
      }
    },
    getHighlight () {
      return this.highlights.details_description_s?.[0].substring(0, this.maxChar)
    },
    getTags () {
      const tags = this.tags
      const status = this.statusTags
      const applicant = this.applicantTag
      if (tags?.length > 0 && status?.length > 0) {
        const hasLabelProperty = Object.prototype.hasOwnProperty.call(status[0], 'label')
        if (hasLabelProperty) {
          return status.concat(tags)
        }
        return tags
      } else {
        return applicant || null
      }
    },
    votingTimeLeft () {
      const end = new Date(`${this.expirationDate}`).getTime()
      const now = Date.now()
      const t = end - now
      return t
    },
    votingExpired () {
      return this.votingTimeLeft < 0
    },
    statusTags () {
      if (this.status === 'approved') {
        return [{ label: 'Active', color: 'positive' }]
      }
      if (this.status === 'proposed') {
        if (this.votingExpired) {
          return [{ label: 'Pending to close', color: 'warning' }]
        } else {
          return [{ label: 'Voting', color: 'warning' }]
        }
      }
      if (this.status === 'suspended') {
        return [{ label: 'Suspended', color: 'negative' }]
      }
      if (this.status === 'rejected') {
        return [{ label: 'Archived', color: 'grey' }]
      }
      if (this.status === 'archived') {
        return [{ label: 'Archived', color: 'grey' }]
      }
      if (this.status === 'withdrawed') {
        return [{ color: 'negative', label: 'Withdrawn' }]
      }
      return [{}]
    },
    applicantTag () {
      if (this.type === 'Member' && this.applicant) {
        return [{ label: 'Applicant', color: 'secondary' }]
      } else {
        return null
      }
    },
    tags () {
      const tags = []
      if (this.type === 'withdrawed') tags.push({ color: 'negative', label: 'Withdrawn', text: 'white' })

      if (this.type === 'Payout') {
        const [usdAmount] = this.salary.split(' ')
        return [
          { color: 'primary', label: 'Generic Contribution' },
          { color: 'primary', outline: true, label: `${this.getFormatedTokenAmount(usdAmount, 3, 0)} HUSD` }
        ]
      }

      if (this.type === 'Assignment' || this.type === 'Edit') {
        return [
          { color: 'primary', label: 'Role Assignment' },
          ...tags
          // { color: 'primary', outline: true, label: 'Circle One' }
          // { color: 'primary', label: 'B3' },
          // { color: 'internal-bg', label: '80%', text: 'grey-7' }
        ]
      }

      if (this.type === 'Assignbadge') {
        return [
          { color: 'primary', label: 'Badge Assignment' },
          ...tags
          // { color: 'primary', outline: true, label: 'Assign' }
          // { color: 'primary', outline: true, label: 'Circle One' }
        ]
      }

      if (this.type === 'Suspend') {
        return [
          { color: 'warning', label: 'Suspension' }
        ]
      }

      if (this.type === 'Role') {
        const [amount] = this.salary.split(' ')
        const band = this.getSalaryBucket(amount)
        return [
          { color: 'primary', label: ' Role Archetype' },
          { color: 'primary', outline: true, label: `${band} ${this.getFormatedTokenAmount(amount, 3, 0)}` }
        ]
      }

      if (this.type === 'Badge') {
        return [
          { color: 'primary', label: 'Badge' }
        ]
      }

      return null
    }
  },
  data () {
    return {
      maxChar: 50,
      author: '',
      header: ''
    }
  },
  mounted () {
    this.header = this.title
    this.author = this.creator
  }
}
</script>

<style scope lang="stylus">
.grey-color
  color: #84878E
.spacingInfo
  max-width: 50%
</style>
