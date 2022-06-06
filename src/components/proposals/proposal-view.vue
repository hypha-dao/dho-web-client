<script>
import { mapActions, mapGetters } from 'vuex'
/**
 * An expansive widget that contains all the details of a proposal.
 * It is used on the proposal detail page and the creation wizard.
 */
import { isURL } from 'validator'
import { format } from '~/mixins/format'
export default {
  name: 'proposal-view',
  mixins: [format],
  components: {
    ProposalCardChips: () => import('./proposal-card-chips.vue'),
    PayoutAmounts: () => import('~/components/common/payout-amounts.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue'),
    IpfsFileViewer: () => import('~/components/ipfs/ipfs-file-viewer.vue'),
    ProposalDynamicPopup: () => import('~/components/proposals/proposal-dynamic-popup.vue')
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
    compensation: Object,
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
    periodCount: Number,
    id: String,
    ownAssignment: Boolean,
    state: String,
    withToggle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      iconDetails: undefined,
      newDeferred: undefined,
      newCommit: undefined,
      showDefferredPopup: false,
      showCommitPopup: false,
      toggle: false,
      cycleDurationSec: 2629800
    }
  },
  async mounted () {
    if (this.icon) {
      this.iconDetails = await this.loadIconDetails()
    }
  },
  activated () {
    this.newDeferred = undefined
    this.newCommit = undefined
    this.showDefferredPopup = false
    this.showCommitPopup = false
  },
  watch: {
    async icon (v) {
      if (v) {
        this.iconDetails = await this.loadIconDetails()
      }
    }
  },
  computed: {
    ...mapGetters('dao', ['daoSettings']),
    salaryBand () {
      return this.getSalaryBucket(this.salary)
    },
    profile () {
      return `/${this.$store.getters['dao/selectedDao'].name}/@${this.creator}`
    },
    descriptionWithoutSpecialCharacters () {
      const regex = /&nbsp;/gi
      return this.description?.replace(regex, '\n')
    },
    isIpfsFile () {
      return !isURL(this.url, { require_protocol: true })
    },
    compensationLabel () {
      return !this.toggle ? 'Compensation for one cycle' : 'Compensation for one period'
    },
    tokensByCycle () {
      return this.tokens.map(token => ({ ...token, value: (token.value || 0) / this.periodsOnCycle }))
    },
    periodsOnCycle () {
      return (this.cycleDurationSec / this.daoSettings.periodDurationSec).toFixed(2)
    }
  },

  methods: {
    ...mapActions('assignments', ['adjustCommitment', 'adjustDeferred']),
    async loadIconDetails () {
      let type = null
      let name = null
      let cid = null
      if (this.icon) {
        const split = this.icon.split(':')
        type = split[0]
        name = split[2] ? `${split[1]}:${split[2]}` : split[1]
        // console.log('icon', type, name)
        if (type === 'http' || type === 'https') {
          type = 'img'
          name = this.icon
        } else if (type === 'ipfsImage') {
          type = 'ipfs'
          cid = name
        }
      }
      return {
        type,
        name,
        cid
      }
    },
    openDocumentation () {
      window.open(this.url, '_blank')
    },
    async onCommitmentEdit (value) {
      this.showCommitPopup = false
      if (await this.adjustCommitment({ docId: this.id, commitment: value })) {
        this.newCommit = value
        this.$emit('change-commit', value)
      }
    },
    async onDeferredEdit (value) {
      this.showDefferredPopup = false
      if (await this.adjustDeferred({ docId: this.id, deferred: value })) {
        this.newDeferred = value
        this.$emit('change-deferred', value)
      }
    }
  }
}
</script>

<template lang="pug">
widget.proposal-view.q-mb-sm
  .row
    proposal-card-chips(:type="type" :state="state" :showVotingState="false" :compensation="compensation" :salary="salary" v-if="!ownAssignment")
  .row.q-my-sm
    .column
      .text-h6.text-bold {{ title }}
      .text-italic.text-body {{ subtitle }}
  .row.q-my-sm(v-if="type === 'Assignment' || type === 'Edit' || type === 'Payout' || type === 'Assignbadge' || type === 'Badge'")
    .col(v-if="periodCount")
      .bg-internal-bg.rounded-border.q-pa-md.q-mr-xs.full-height
        .text-bold Date and duration
        .text-grey-7.text-body2 {{ periodCount }} period{{periodCount > 1 ? 's' : ''}}, starting {{ start }}
    .col.q-mr-sm.bg-internal-bg.rounded-border(v-if="type === 'Badge'")
      .bg-internal-bg.rounded-border.q-pa-md.q-ml-xs
        .text-bold Badge Restrictions
        .text-grey-7.text-body2 {{ restrictions }}
    .col.q-mr-sm(v-if="(type === 'Role' || type === 'Assignment')")
      .row.bg-internal-bg.rounded-border.q-pa-md.q-ml-xs
        .col-6(v-if="commit !== undefined")
          .text-bold Commitment level
          .text-grey-7.text-body2 {{ (newCommit !== undefined ? newCommit : commit.value) + '%' }}
            .text-secondary.text-body2.q-ml-xxs.inline(v-if="ownAssignment && (newCommit ? newCommit : commit.value) !== commit.max") {{(newCommit ? newCommit : commit.value) - commit.max + '%' }}
            .dynamic-popup(v-if="showCommitPopup")
              proposal-dynamic-popup(
                title="Adjust Commitment"
                description="Multiple adjustments to your commitment will be included in the calculation."
                :step="5"
                :min="commit.min"
                :max="commit.max"
                :initialValue="(newCommit !== undefined ? newCommit : commit.value)"
                @close="showCommitPopup = false"
                @save="onCommitmentEdit").q-pa-xxl.absolute
            q-btn.q-ml-xxxl(
            flat round size="sm"
            icon="fas fa-pen"
            color="primary"
            v-if="ownAssignment && state === 'approved'"
            @click="showCommitPopup = true; showDefferredPopup = false")
              q-tooltip Edit
        .col-6(v-if="deferred !== undefined && type !== 'Payout'")
          .text-bold Deferred amount
          .text-grey-7.text-body2 {{ (newDeferred !== undefined ? newDeferred : deferred.value) + '%' }}
            .dynamic-popup(v-if="showDefferredPopup")
              proposal-dynamic-popup(
                title="Adjust Deferred"
                description="The % deferral will be immediately reflected on your next claim"
                :step="1"
                :min="deferred.min"
                :max="deferred.max"
                :initialValue="(newDeferred !== undefined ? newDeferred : deferred.value)"
                @close="showDefferredPopup = false"
                @save="onDeferredEdit").q-pa-xxl.absolute
            q-btn.q-ml-xxxl(
            flat round size="sm"
            icon="fas fa-pen"
            color="primary"
            v-if="ownAssignment && state === 'approved'"
            @click="showDefferredPopup = true; showCommitPopup = false")
              q-tooltip Edit
    .col.bg-internal-bg.rounded-border.q-mr-xs(v-if="icon")
      .row.full-width.q-pt-md.q-px-md.q-ml-xs.justify-between(v-if="iconDetails")
        .text-bold Icon
        q-btn.no-pointer-events(
          round unelevated :icon="iconDetails.name" color="primary" text-color="white" size="15px" :ripple="false"
          v-if="iconDetails.type === 'icon'"
        )
        q-avatar(size="lg" v-else-if="iconDetails.type === 'img'")
            img.icon-img(:src="iconDetails.name")
        ipfs-image-viewer(size="lg", :ipfsCid="iconDetails.cid" v-else-if="iconDetails.type === 'ipfs'")
  .row.q-my-sm(v-if="type === 'Role'")
    .col-6
      .bg-internal-bg.rounded-border.q-pa-md.q-mr-xs
        .text-bold Salary band
        .text-grey-7.text-body2 {{ salary }} equivalent per year
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
      .row.q-ml-md.q-py-md.text-bold(v-if="withToggle" ) {{ compensationLabel }}
      payout-amounts(:daoLogo="daoSettings.logo" :tokens="!toggle ? tokens : tokensByCycle" :class="{ 'q-pa-md': !withToggle }")
      .row.items-center.q-py-md.q-ml-xxs(v-if="withToggle")
        .col-1
          q-toggle(v-model="toggle" size="md")
        .col.q-mt-xxs Show compensation for one period
    .col-3.bg-internal-bg.rounded-border.q-py-md.q-pa-md.q-ml-xs(v-if="type === 'Payout' && deferred && deferred.value >= 0")
      .q-pa-xs
        .row.q-mb-sm
          .col.text-bold Deferred amount
        .row.q-pt-xs
          .text-grey-7.text-body2 {{ deferred.value + '%' }}
  .text-bold.q-mt-lg.q-mb-sm Description
  .row
    q-markdown(:src="descriptionWithoutSpecialCharacters")
  .row.items-center.q-mb-md(v-if="url")
    q-icon(name="far fa-file" size="xs" color="primary")
    ipfs-file-viewer(v-if="isIpfsFile" size="lg", :ipfsCid="url")
    a.on-right(v-else :href="url") {{ url }}
  .row.top-border.q-pt-md.justify-between(v-if="!preview")
    profile-picture(:username="creator" show-name size="40px" link)
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
.inline
  display: inline !important
.dynamic-popup
  display: inline-block
  position: relative
  top: -340px
  left: -100%
  z-index: 10
</style>
