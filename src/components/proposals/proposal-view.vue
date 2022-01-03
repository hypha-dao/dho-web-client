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
    subtitle: String,
    tags: Array,
    title: String,
    tokens: Array,
    type: String,
    url: String,
    capacity: Number,
    salary: String,
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
      default: () => {
        return {
          value: 100
        }
      }
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
      .text-h6 {{ title }}
      .text-italic.text-grey-6 {{ subtitle }}
  .row.q-my-sm(v-if="type === 'Assignment' || type === 'Edit'")
    .col-6
      .bg-grey-4.rounded-border.q-pa-md.q-mr-xs
        .text-bold Date and duration
        .text-grey-7.text-body2 {{ periodCount }} period{{periodCount > 1 ? 's' : ''}}, starting {{ start }}
    .col-6
      .row.bg-grey-4.rounded-border.q-pa-md.q-ml-xs
        .col-6
          .text-bold Committment level
          .text-grey-7.text-body2 {{ commit.value + '%' }}
        .col-6
          .text-bold Deferred amount
          .text-grey-7.text-body2 {{ deferred.value + '%' }}
  .row.q-my-sm(v-if="type === 'Role'")
    .col-6
      .bg-grey-4.rounded-border.q-pa-md.q-mr-xs
        .text-bold Salary band
        .text-grey-7.text-body2 {{ '' + salaryBand + salary }} per year
    .col-6
      .row.bg-grey-4.rounded-border.q-pa-md.q-ml-xs
        .col-6
          .text-bold Min deferred amount
          .text-grey-7.text-body2 {{ deferred.min + '%' }}
        .col-6
          .text-bold Role capacity
          .text-grey-7.text-body2 {{ capacity }}
  .row.q-my-sm.bg-grey-4.rounded-border
    payout-amounts.q-py-md(:tokens="tokens")
  .row
    q-markdown(:src="description")
  .row.items-center.q-mb-md
    q-icon(name="far fa-file" size="xs" color="primary")
    a.on-right(:href="url") {{ url }}
  .row.top-border.q-pt-md.justify-between(v-if="!preview")
    profile-picture(:username="creator" show-name size="40px")
    q-btn(flat color="primary" no-caps rounded :disable="creator === null" :to="{ path: `/preview/@${creator}` }") See profile
</template>

<style lang="stylus" scoped>
.rounded-border
  border-radius 24px

.top-border
  border-top 1px solid $grey-4
</style>
