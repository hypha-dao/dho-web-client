<script>
/**
 * An expansive widget that contains all the details of a proposal.
 * It is used on the proposal detail page and the creation wizard.
 */
export default {
  name: 'proposal-view',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    PayoutAmounts: () => import('~/components/common/payout-amounts.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    /**
     * Account of proposal creator
     */
    creator: String,
    /**
     * Description string of proposal, in markdown
     */
    description: String,
    /**
     * Whether this is preview step of creation wizard
     */
    preview: Boolean,
    start: String,
    icon: String,
    subtitle: String,
    tags: Array,
    title: String,
    tokens: Array,
    type: String,
    url: String,
    capacity: Number,
    salary: [String, Number],
    restrictions: [String, Number],
    commit: {
      type: Object,
      default: () => {
        return {
          value: 100
        }
      }
    },
    deferred: {
      type: Object,
      default: () => undefined
    },
    periodCount: Number
  },

  computed: {
    salaryBand () {
      // TODO: Get this from dho creation config?
      const amount = parseFloat(this.salary)
      if (amount <= 80000) {
        return 'B1, '
      } else if (amount > 80000 && amount <= 100000) {
        return 'B2, '
      } else if (amount > 100000 && amount <= 120000) {
        return 'B3, '
      } else if (amount > 120000 && amount <= 140000) {
        return 'B4, '
      } else if (amount > 140000 && amount <= 160000) {
        return 'B5, '
      } else if (amount > 160000 && amount <= 180000) {
        return 'B6, '
      } else if (amount > 180000) {
        return 'B7, '
      }

      return ''
    },
    iconDetails () {
      let type = null
      let name = null
      if (this.icon) {
        const split = this.icon.split(':')
        type = split[0]
        name = split[1]
        if (type === 'http' || type === 'https') {
          type = 'img'
          name = this.icon
        }
      }
      return {
        type,
        name
      }
    },
    profile () {
      return `/${this.$store.getters['dao/selectedDao'].name}/@${this.creator}`
    }
  },

  methods: {
    openDocumentation () {
      window.open(this.url, '_blank')
    }
  }
}
</script>

<template lang="pug">
widget.proposal-view.q-mb-sm
  .row
    chips(:tags="tags")
  .row.q-my-sm
    .column
      .text-h6.text-bold {{ title }}
      .text-italic.text-body {{ subtitle }}
  .row.q-my-sm(v-if="type === 'Assignment' || type === 'Edit' || type === 'Payout' || type === 'Assignbadge' || type === 'Badge'")
    .col(v-if="periodCount")
      .bg-internal-bg.rounded-border.q-pa-md.q-mr-xs
        .text-bold Date and duration
        .text-grey-7.text-body2 {{ periodCount }} period{{periodCount > 1 ? 's' : ''}}, starting {{ start }}
    .col.q-mr-sm.bg-grey-4.rounded-border(v-if="type === 'Badge'")
      .bg-grey-4.rounded-border.q-pa-md.q-ml-xs
        .text-bold Badge Restrictions
        .text-grey-7.text-body2 {{ restrictions }}
    .col.q-mr-sm(v-if="commit.value > 0 && (type === 'Role' || type === 'Assignment')")
      .row.bg-grey-4.rounded-border.q-pa-md.q-ml-xs
        .col-6(v-if="commit.value > 0")
          .text-bold Commitment level
          .text-grey-7.text-body2 {{ commit.value + '%' }}
        .col-6(v-if="deferred && type !== 'Payout'")
          .text-bold Deferred amount
          .text-grey-7.text-body2 {{ deferred.value + '%' }}
    .col.bg-internal-bg.rounded-border.q-mr-xs(v-if="icon")
      .row.full-width.q-pt-md.q-px-md.q-ml-xs.justify-between
        .text-bold Icon
        q-btn.no-pointer-events(
          round unelevated :icon="iconDetails.name" color="primary" text-color="white" size="15px" :ripple="false"
          v-if="iconDetails.type === 'icon'"
        )
        q-avatar(size="lg" v-else)
            img.icon-img(:src="iconDetails.name")
  .row.q-my-sm(v-if="type === 'Role'")
    .col-6
      .bg-internal-bg.rounded-border.q-pa-md.q-mr-xs
        .text-bold Salary band
        .text-grey-7.text-body2 {{ '' + salaryBand + salary }} per year
    .col-6
      .row.bg-internal-bg.rounded-border.q-pa-md.q-ml-xs
        .col-6
          .text-bold Min deferred amount
          .text-grey-7.text-body2 {{ deferred.min + '%' }}
        .col-6
          .text-bold Role capacity
          .text-grey-7.text-body2 {{ capacity }}
  .row.q-my-sm(v-if="tokens")
    .col.bg-internal-bg.rounded-border
      payout-amounts.q-py-md(:tokens="tokens")
    .col-3.bg-internal-bg.rounded-border.q-py-md.q-pa-md.q-ml-xs(v-if="type === 'Payout' && deferred.value >= 0")
      .q-pa-xs
        .row.q-mb-sm
          .col.text-bold Deferred amount
        .row.q-pt-xs
          .text-grey-7.text-body2 {{ deferred.value + '%' }}
  .text-bold.q-mt-lg.q-mb-sm Description
  .row
    q-markdown(:src="description")
  .row.items-center.q-mb-md(v-if="url")
    q-icon(name="far fa-file" size="xs" color="primary")
    a.on-right(:href="url") {{ url }}
  .row.top-border.q-pt-md.justify-between(v-if="!preview")
    profile-picture(:username="creator" show-name size="40px")
    q-btn(flat color="primary" no-caps rounded :disable="creator === null" :to="profile") See profile
  .row
    slot(name="bottom")
</template>

<style lang="stylus" scoped>
.rounded-border
  border-radius 24px

.top-border
  border-top 1px solid $internal-bg

.icon-img
  height: 50px
</style>
