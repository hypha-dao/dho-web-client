<script>
import { mapActions, mapGetters } from 'vuex'
/**
 * An expansive widget that contains all the details of a proposal.
 * It is used on the proposal detail page and the creation wizard.
 */
import { isURL } from 'validator'
import { format } from '~/mixins/format'
import { PROPOSAL_TYPE, PROPOSAL_STATE } from '~/const'

// import { proposals } from '~/mixins/proposals'
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
    ProposalDynamicPopup: () => import('~/components/proposals/proposal-dynamic-popup.vue'),
    VersionHistory: () => import('~/components/proposals/version-history.vue'),
    QuestProgression: () => import('~/components/proposals/quest-progression.vue'),
    CirclesWidget: () => import('~/components/organization/circles-widget.vue')
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
    created: Date,
    start: String,
    icon: String,
    subtitle: String,
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
      default: undefined
    },
    deferred: {
      type: Object,
      default: () => undefined
    },
    periodCount: Number,
    docId: String,
    status: String,
    /**
     * Whether this is preview step of creation wizard
     */
    preview: Boolean,
    ownAssignment: Boolean,
    withToggle: {
      type: Boolean,
      default: true
    },
    isBadge: Boolean,
    pastQuorum: Number,
    pastUnity: Number,
    purpose: String,
    proposal: Object,
    masterPolicy: Object,
    parentQuest: Object,
    votingMethod: String,
    circle: Object,
    parentCircle: Array,
    hidePolicyHistory: Boolean
  },
  data () {
    return {
      PROPOSAL_TYPE,
      PROPOSAL_STATE,
      iconDetails: undefined,
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
      return `/${this.daoSettings.settings_daoUrl_s}/@${this.creator}`
    },
    descriptionWithoutSpecialCharacters () {
      const regex = /&nbsp;/gi
      return this.description?.replace(regex, '\n')
    },
    isIpfsFile () {
      return !isURL(this.url, { require_protocol: true })
    },
    compensationLabel () {
      return !this.toggle ? this.$t('proposals.proposal-view.compensationForOneCycle') : this.$t('proposals.proposal-view.compensationForOnePeriod')
    },
    tokensByCycle () {
      return this.tokens.map(token => ({ ...token, value: (token?.value || 0) / this.periodsOnCycle }))
    },
    periodsOnCycle () {
      return (this.cycleDurationSec / this.daoSettings.periodDurationSec).toFixed(2)
    },
    commitDifference () {
      return (this.commit?.value) - this.commit.max
    },
    state () {
      switch (this.$router.currentRoute.name) {
        case 'proposal-create':
          return PROPOSAL_STATE.CREATING
      }
      return ''
    },
    showDefferedValue () {
      return this.$store.state.dao.settings.pegToken && this.$store.state.dao.settings.rewardToken
    },
    isBadgeAssignment () {
      return this.type === PROPOSAL_TYPE.ASSIGNBADGE
    },
    getBadgeAssignmentIcon () {
      return this.proposal?.badge?.[0]?.details_icon_s
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
      if (await this.adjustCommitment({ docId: this.docId, commitment: value })) {
        this.$emit('change-commit', value)
      }
    },
    async onDeferredEdit (value) {
      this.showDefferredPopup = false
      if (await this.adjustDeferred({ docId: this.docId, deferred: value })) {
        this.$emit('change-deferred', value)
      }
    },
    goToBadge () {
      this.$router.push({ name: 'organization/assets/badge', params: { docId: this.proposal?.badge?.[0]?.docId } })
    }
  },
  apollo: {
    circleData: {
      query: require('~/query/circles/dao-circle-details-review-step.gql'),
      update: data => {
        const circle = data.getDocument
        return [circle]
      },
      skip () { return !this.circle?.value },
      variables () {
        return { docId: this.circle?.value }
      }
    }
  }
}
</script>

<template lang="pug">
widget.proposal-view.q-mb-sm
  .row
    .col
      .row
        proposal-card-chips(:proposal="proposal" :type="type" :state="status" :showVotingState="false" :compensation="compensation" :salary="salary" v-if="!ownAssignment" :commit="commit && commit.value")
    .col.justify-end.flex.items-center(v-if="periodCount")
      .text-grey.text-italic(:style="{ 'font-size': '12px' }") {{ `Starting ${start} | Duration: ${periodCount} period${periodCount > 1 ? 's' : ''}` }}
      q-tooltip(anchor="center end") {{ $t('proposals.proposal-view.1MoonPeriod') }}
    .col.justify-end.flex.items-center(v-if="isBadgeAssignment")
      .text-grey.text-italic(:style="{ 'font-size': '12px' }") {{ `Badge validity: ${this.proposal.details_periodCount_i} period${this.proposal.details_periodCount_i > 1 ? 's' : ''}` }}
  .row.q-my-sm
    .col-1.flex.items-center(v-if="isBadgeAssignment")
      img.icon-img(:src="getBadgeAssignmentIcon")
    .col
      .text-grey.text-italic(v-if="isBadgeAssignment" :style="{ 'font-size': '12px' }") {{ $t('proposals.proposal-view.badgeName') }}
      .text-grey.text-italic(v-else :style="{ 'font-size': '12px' }") {{ $t('proposals.proposal-view.title') }}
      .row
        .column
          .text-h5.text-bold {{ title }}
          .text-italic.text-body {{ subtitle }}
  version-history(v-if="type === PROPOSAL_TYPE.POLICY && !hidePolicyHistory" :proposalId="proposal?.docId ? proposal?.docId : docId")
  quest-progression(v-if="type === PROPOSAL_TYPE.QUEST_START && status === PROPOSAL_STATE.APPROVED" :proposalId="proposal?.docId ? proposal?.docId : docId")
  .q-my-sm(:class="{ 'row':$q.screen.gt.md }" v-if="type === PROPOSAL_TYPE.ROLE || type === PROPOSAL_TYPE.EDIT || type === PROPOSAL_TYPE.PAYOUT || type === PROPOSAL_TYPE.ABILITY || type === PROPOSAL_TYPE.BADGE")
    .col.bg-internal-bg.rounded-border(:class="{ 'q-mr-xs':$q.screen.gt.md, 'q-mb-sm':$q.screen.lt.md || $q.screen.md }" v-if="icon")
      .row.full-width.q-pt-md.q-px-md.q-ml-xs(:class="{ 'q-pb-md':$q.screen.lt.md || $q.screen.md }" v-if="iconDetails")
        q-btn.no-pointer-events(round unelevated :icon="iconDetails.name" color="primary" text-color="white" size="15px" :ripple="false" v-if="iconDetails.type === 'icon'")
        q-avatar(size="lg" v-else-if="iconDetails.type === 'img'")
          img.icon-img(:src="iconDetails.name")
        ipfs-image-viewer(size="lg" :ipfsCid="iconDetails.cid" v-else-if="iconDetails.type === 'ipfs'")
        .text-bold.q-ml-md {{ $t('proposals.proposal-view.icon') }}
    .col.bg-internal-bg.rounded-border(:class="{ 'q-mb-sm':$q.screen.lt.md || $q.screen.md }" v-if="type === PROPOSAL_TYPE.BADGE")
      .bg-internal-bg.rounded-border.q-pa-md.q-ml-xs
        .text-bold {{ $t('proposals.proposal-view.votingSystem') }}
        .text-grey-7.text-body2 {{ `Quorum: ${pastQuorum ? pastQuorum : '20'} | Unity: ${pastUnity ? pastUnity : '80'}` }}
    .col(v-if="(type === PROPOSAL_TYPE.ARCHETYPE || type === PROPOSAL_TYPE.ROLE || (deferred && commit && type === PROPOSAL_TYPE.EDIT) )")
      .row.bg-internal-bg.rounded-border.q-pa-md
        .col-6(v-if="commit !== undefined")
          .text-bold.q-mb-xs {{ $t('proposals.proposal-view.commitmentLevel') }}
          widget.q-mr-sm(:style="{ 'padding': '12px 15px', 'border-radius': '15px' }")
            .text-grey-7.text-body2 {{ (commit?.value) + '%' }}

              .text-secondary.text-body2.q-ml-xxs.inline(v-if="ownAssignment && commitDifference") {{commitDifference}}
                | %
              .dynamic-popup(v-if="showCommitPopup")
                proposal-dynamic-popup.q-pa-xxl.absolute(:title="$t('proposals.proposal-view.adjustCommitment')" :description="$t('proposals.proposal-view.multipleAdjustmentsToYourCommitment')" :step="5" :min="commit.min" :max="commit.max" :initialValue="commit?.value" @close="showCommitPopup = false" @save="onCommitmentEdit")
              q-btn.q-ml-xxxl(flat round size="sm" icon="fas fa-pen" color="primary" v-if="ownAssignment && status === PROPOSAL_STATE.APPROVED" @click="showCommitPopup = true; showDefferredPopup = false")
                q-tooltip {{ $t('proposals.proposal-view.edit') }}
        .col-6(v-if="deferred !== undefined && type !== PROPOSAL_TYPE.PAYOUT")
          .text-bold.q-mb-xs {{ $t('proposals.proposal-view.deferredAmount') }}
          widget(:style="{ 'padding': '12px 15px', 'border-radius': '15px' }")
            .text-grey-7.text-body2 {{ deferred?.value + '%' }}
              .dynamic-popup(v-if="showDefferredPopup")
                proposal-dynamic-popup.q-pa-xxl.absolute(:title="$t('proposals.proposal-view.adjustDeferred')" :description="$t('proposals.proposal-view.thePercentDeferralWillBe')" :step="1" :min="deferred.min" :max="deferred.max" :initialValue="deferred?.value" @close="showDefferredPopup = false" @save="onDeferredEdit")
              q-btn.q-ml-xxxl(flat round size="sm" icon="fas fa-pen" color="primary" v-if="(state !== PROPOSAL_STATE.CREATING) && (ownAssignment) && (status === PROPOSAL_STATE.APPROVED || status === PROPOSAL_TYPE.ARCHIVED)" @click="showDefferredPopup = true; showCommitPopup = false")
                q-tooltip {{ $t('proposals.proposal-view.edit1') }}
  .q-my-sm(:class="{ 'row':$q.screen.gt.md }" v-if="type === PROPOSAL_TYPE.ARCHETYPE")
    .col-6
      .bg-internal-bg.rounded-border.q-pa-md(:class="{ 'q-mr-xs':$q.screen.gt.md }")
        .text-bold {{ $t('proposals.proposal-view.salaryBand') }}
        .text-grey-7.text-body2 {{ $t('proposals.proposal-view.equivalentPerYear', { '1': salary }) }}
    .col-6
      .row.bg-internal-bg.rounded-border.q-pa-md(:class=" { 'q-ml-xs':$q.screen.gt.md, 'q-mt-sm':$q.screen.lt.md || $q.screen.md }")
        .col-6
          .text-bold {{ $t('proposals.proposal-view.minDeferredAmount') }}
          .text-grey-7.text-body2 {{ deferred.min + '%' }}
        .col-6
          .text-bold {{ $t('proposals.proposal-view.roleCapacity') }}
          .text-grey-7.text-body2 {{ capacity }}
      .q-pa-xs
  template(v-if="tokens && (type === PROPOSAL_TYPE.ROLE || type === PROPOSAL_TYPE.PAYOUT || type === PROPOSAL_TYPE.QUEST_START || type === PROPOSAL_TYPE.QUEST_PAYOUT || type === PROPOSAL_TYPE.QUEST || type === PROPOSAL_TYPE.BUDGET)")
    .text-grey.text-italic(:style="{ 'font-size': '12px' }") {{ $t('proposals.proposal-view.compensation1') }}
    .q-my-sm(:class="{ 'row':$q.screen.gt.md }")
      .col.bg-internal-bg(:style="{ 'border-radius': '25px' }")
        .row.q-ml-md.q-py-md.text-bold(v-if="withToggle") {{ compensationLabel }}
          q-tooltip(v-if="toggle" anchor="center start") {{ $t('proposals.proposal-view.1MoonPeriod') }}
          q-tooltip(v-else anchor="center start") {{ $t('proposals.proposal-view.1MoonCycle') }}
        payout-amounts(:daoLogo="daoSettings.logo" :tokens="!toggle ? tokens : tokensByCycle" :class="{ 'q-pa-md': !withToggle }")
        .row.items-center.q-py-md.q-ml-xs(v-if="withToggle")
          .div(:class="{ 'col-1':$q.screen.gt.md }")
            q-toggle(v-model="toggle" size="md")
          .col.q-mt-xxs {{ $t('proposals.proposal-view.showCompensationFor') }}
            q-tooltip(anchor="center start") {{ $t('proposals.proposal-view.1MoonPeriod') }}
      .col-3.bg-internal-bg.q-py-md.q-pa-md(:style="{ 'border-radius': '25px' }" :class="{ 'q-ml-xxs':$q.screen.gt.md, 'q-mt-md':$q.screen.lt.md || $q.screen.md }" v-if="type === PROPOSAL_TYPE.PAYOUT && deferred && deferred?.value >= 0 && showDefferedValue")
        .row.q-mb-sm
          .col.text-bold {{ $t('proposals.proposal-view.deferredAmount1') }}
        widget.q-pt-xs(:style="{ 'padding': '12px 15px', 'border-radius': '15px' }")
          .row
            .text-grey-7.text-body2 {{ deferred?.value + '%' }}
  template(v-if="parentCircle?.length")
    .text-xs.text-grey.text-italic {{ $t('proposals.proposal-view.parentCircle') }}
    circles-widget(:circles="parentCircle" singleCircle)
  template(v-if="circle")
    .q-mt-md
      .text-xs.text-grey.text-italic {{ $t('proposals.proposal-view.parentCircle1') }}
      circles-widget(:circles="circleData" singleCircle)
  template(v-if="masterPolicy")
    .text-xs.text-grey.text-italic {{ $t('proposals.proposal-view.parentPolicy') }}
    .row.q-mb-lg {{ masterPolicy.label }}
  .text-grey.text-italic(v-if="isBadgeAssignment" :style="{ 'font-size': '12px' }") {{ $t('proposals.proposal-view.applicantMessage') }}
  .text-grey.text-italic(v-else-if="descriptionWithoutSpecialCharacters" :style="{ 'font-size': '12px' }") {{ $t('proposals.proposal-view.description') }}
  .row
    q-markdown(:style="'width: -webkit-fill-available;'" :src="descriptionWithoutSpecialCharacters")
  template(v-if="isBadgeAssignment")
    .text-grey.text-italic(:style="{ 'font-size': '12px' }") {{ $t('proposals.proposal-view.badgeDescription') }}
    .row
      q-markdown(:style="'width: -webkit-fill-available;'" :src="this.proposal.badge?.[0].details_description_s")
  .text-grey.text-italic.q-mb-sm(v-if="url" :style="{ 'font-size': '12px' }") {{ $t('proposals.proposal-view.attachedDocuments') }}
  .row.items-center.q-mb-md.bg-internal-bg.relative(v-if="url" :style="{ 'padding': '7px 10px', 'border-radius': '15px' }")
    q-icon(name="far fa-file" size="xs" color="primary")
    ipfs-file-viewer(v-if="isIpfsFile" size="lg" :ipfsCid="url")
    a.on-right(v-else :href="url") {{ url }}
    q-icon.absolute(name="fas fa-chevron-right" :style="{ 'right': '10px' }")
  .row.flex.items-center.q-mb-md(v-if="isBadgeAssignment")
    .text-primary.text-underline.cursor-pointer(@click="goToBadge()" :style="'font-size: 12px; font-weight: 600;'") See Badge Details
    q-icon(size="10px" name="fas fa-chevron-right")
  template(v-if="!preview && !isBadge")
    .text-grey.text-italic.top-border.q-pt-sm(:style="{ 'font-size': '12px' }") {{ $t('proposals.proposal-view.createdBy') }}
    .row.q-pt-md.justify-between
      profile-picture(:username="creator" show-name size="40px" link)
      q-btn(flat color="primary" no-caps rounded :disable="creator === null" :to="profile") {{ $t('proposals.proposal-view.seeProfile') }}
  .row
    slot(name="bottom")

</template>

<style lang="stylus" scoped>
.rounded-border
  border-radius 15px

.top-border
  border-top 1px solid $internal-bg

.icon-img
  height: 50px
.inline
  display: inline !important
.dynamic-popup
  display: inline-block
  margin: 0
  position: absolute
  top: 50%
  transform: translateY(-50%)
  z-index: 10
</style>
