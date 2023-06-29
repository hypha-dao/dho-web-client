<template lang="pug">
widget.bg-internal-bg.q-mb-sm
  .row.items-center.justify-between
    q-btn(v-if="username === ''" round="round" unelevated="unelevated" :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
    profile-picture(v-else :username="username" size="28px")
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
        case 'Edit':            return 'Extension'
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
        return [{ label: this.$t('search.results.result.active'), color: 'positive' }]
      }
      if (this.status === 'proposed') {
        if (this.votingExpired) {
          return [{ label: this.$t('search.results.result.pendingToClose'), color: 'warning' }]
        } else {
          return [{ label: this.$t('search.results.result.voting'), color: 'warning' }]
        }
      }
      if (this.status === 'suspended') {
        return [{ label: this.$t('search.results.result.suspended'), color: 'negative' }]
      }
      if (this.status === 'rejected') {
        return [{ label: this.$t('search.results.result.archived'), color: 'grey' }]
      }
      if (this.status === 'archived') {
        return [{ label: this.$t('search.results.result.archived'), color: 'grey' }]
      }
      if (this.status === 'withdrawed') {
        return [{ color: 'negative', label: this.$t('search.results.result.withdrawn') }]
      }
      return [{}]
    },
    applicantTag () {
      if (this.type === 'Member' && this.applicant) {
        return [{ label: this.$t('search.results.result.applicant'), color: 'secondary' }]
      } else {
        return null
      }
    },
    tags () {
      const tags = []
      if (this.type === 'withdrawed') tags.push({ color: 'negative', label: this.$t('search.results.result.withdrawn'), text: 'white' })

      if (this.type === 'Payout') {
        if (this.salary) {
          const [usdAmount] = this.salary.split(' ')
          return [
            { color: 'primary', label: this.$t('search.results.result.genericContribution') },
            { color: 'primary', outline: true, label: `${this.getFormatedTokenAmount(usdAmount, 3, 0)} HUSD` }
          ]
        } else {
          return [
            { color: 'primary', label: this.$t('search.results.result.genericContribution') }
          ]
        }
      }

      if (this.type === 'Edit') {
        tags.push({ color: 'primary', label: this.$t('search.results.result.extension') })
      }

      if (this.type === 'Assignment' || this.type === 'Edit') {
        return [
          { color: 'primary', label: this.$t('search.results.result.roleAssignment') },
          ...tags
          // { color: 'primary', outline: true, label: 'Circle One' }
          // { color: 'primary', label: 'B3' },
          // { color: 'internal-bg', label: '80%', text: 'grey-7' }
        ]
      }

      if (this.type === 'Assignbadge') {
        return [
          { color: 'primary', label: this.$t('search.results.result.badgeAssignment') },
          ...tags
          // { color: 'primary', outline: true, label: 'Assign' }
          // { color: 'primary', outline: true, label: 'Circle One' }
        ]
      }

      if (this.type === 'Suspend') {
        return [
          { color: 'warning', label: this.$t('search.results.result.suspension') }
        ]
      }

      if (this.type === 'Role') {
        return [
          { color: 'primary', label: this.$t('search.results.result.roleArchetype') }
        ]
      }

      if (this.type === 'Badge') {
        return [
          { color: 'primary', label: this.$t('search.results.result.badge') }
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
