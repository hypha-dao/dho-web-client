<script>
import { mapActions, mapGetters } from 'vuex'

const exist = value => value !== undefined

const settingsMapper = (data) => {
  const { name, purpose, url, ...form } = data || {}

  return {
    ...form,
    ...(exist(name) ? { daoTitle: name } : {}),
    ...(exist(purpose) ? { daoDescription: purpose } : {}),
    ...(exist(url) ? { daoUrl: url } : {}),
    ...(exist(form.documentationUrl) ? { documentationUrl: form.documentationUrl } : {}),

    ...(exist(form.proposalsCreationEnabled) ? { proposalsCreationEnabled: form.proposalsCreationEnabled ? 1 : 0 } : {}),

    ...(exist(form.votingAlignmentPercent) ? { votingAlignmentX100: form.votingAlignmentPercent } : {}),
    ...(exist(form.votingQuorumPercent) ? { votingQuorumX100: form.votingQuorumPercent } : {}),

    ...(exist(form.communityVotingEnabled) ? { communityVotingEnabled: form.communityVotingEnabled ? 1 : 0 } : {}),
    ...(exist(form.showUpvoteElection) ? { showUpvoteElection: form.showUpvoteElection ? 1 : 0 } : {})
  }
}

const CONFIGURATION_STATE = Object.freeze({
  WAITING: 'WAITING',
  SAVING: 'SAVING',
  LEAVING: 'LEAVING',
  LEFT: 'LEFT',

  CREATE_MULTI_SIG: 'CREATE_MULTI_SIG',
  SIGN_MULTI_SIG: 'SIGN_MULTI_SIG',
  VIEW_MULTI_SIG: 'VIEW_MULTI_SIG'
})

const defaultSettings = {
  // General
  logo: '',
  title: '',
  description: '',
  url: '',
  documentationUrl: '',
  primaryColor: '#242f5d',
  secondaryColor: '#3F64EE',
  textColor: '#ffffff',

  // Structure
  roles: [],
  levels: [],

  // Voting
  proposalsCreationEnabled: true,
  votingDurationSec: '',
  // periodDurationSec: '',
  votingAlignmentPercent: '',
  votingQuorumPercent: '',

  voiceTokenDecayPeriod: 604800,
  voiceTokenDecayPerPeriod: 1,

  communityVotingEnabled: false,
  communityVotingDurationSec: 604800,
  communityVotingAlignmentPercent: 20,
  communityVotingQuorumPercent: 50,

  // TODO:
  // communityVotingMethod: 'CLASSIC',
  // upvoteStartDateTime: '',
  // upvoteStartDate: '',
  // upvoteStartTime: '',
  // upvoteDuration: 7890000,
  // upvoteRounds: [{ peoplePassing: 50, duration: 10800 }],
  // upvoteCheifDelegateCount: 4,
  // upvoteCheifDelegateDuration: 10800,
  // upvoteHeadDelegateRound: false,
  // upvoteHeadDelegateDuration: 10800,

  showUpvoteElection: false
}

const TABS = Object.freeze({
  GENERAL: 'GENERAL',
  STRUCTURE: 'STRUCTURE',
  TOKENS: 'TOKENS',
  VOTING: 'VOTING'
})

export default {
  name: 'page-configuration',
  components: {
    ConfirmActionModal: () => import('~/components/common/confirm-action-modal.vue'),
    MultisigModal: () => import('~/components/dao/multisig-modal.vue'),

    SettingsGeneral: () => import('~/components/dao/settings-general.vue'),
    SettingsStructure: () => import('~/components/dao/settings-structure.vue'),
    SettingsTokens: () => import('~/components/dao/settings-tokens.vue'),
    SettingsVoting: () => import('~/components/dao/settings-voting.vue')
  },

  data () {
    return {
      CONFIGURATION_STATE,
      TABS,

      form: {},
      initialForm: {},

      state: CONFIGURATION_STATE.WAITING,

      tab: TABS.GENERAL
    }
  },

  methods: {
    ...mapActions('dao', [
      'importEdenElection',
      'updateDAOSettings',

      'createSettingsMultisig',
      'cancelSettingsMultisig',
      'voteSettingsMultisig',
      'executeSettingsMultisig'
    ]),

    initForm () {
      this.initialForm = {
        // General
        logo: this.daoSettings?.logo ? this.daoSettings?.logo : defaultSettings.logo,
        name: this.daoSettings?.title ? this.daoSettings?.title : defaultSettings.title,
        url: this.daoSettings?.url ? this.daoSettings?.url : defaultSettings.url,
        purpose: this.daoSettings?.description ? this.daoSettings?.description : defaultSettings.description,
        documentationUrl: this.daoSettings?.documentationUrl ? this.daoSettings?.documentationUrl : defaultSettings.documentationUrl,

        primaryColor: this.daoSettings?.primaryColor ? this.daoSettings?.primaryColor : defaultSettings.primaryColor,
        secondaryColor: this.daoSettings?.secondaryColor ? this.daoSettings?.secondaryColor : defaultSettings.secondaryColor,
        textColor: this.daoSettings?.textColor ? this.daoSettings?.textColor : defaultSettings.textColor,

        // Voting
        proposalsCreationEnabled: this.daoSettings?.proposalsCreationEnabled !== null ? this.daoSettings?.proposalsCreationEnabled : defaultSettings.proposalsCreationEnabled,
        votingDurationSec: this.daoSettings?.votingDurationSec ? this.daoSettings?.votingDurationSec : defaultSettings.votingDurationSec,
        periodDurationSec: this.daoSettings?.periodDurationSec ? this.daoSettings?.periodDurationSec : defaultSettings.periodDurationSec,
        votingAlignmentPercent: this.daoSettings?.votingAlignmentPercent ? this.daoSettings?.votingAlignmentPercent : defaultSettings.votingAlignmentPercent,
        votingQuorumPercent: this.daoSettings?.votingQuorumPercent ? this.daoSettings?.votingQuorumPercent : defaultSettings.votingQuorumPercent,

        voiceTokenDecayPeriod: this.daoSettings?.voiceTokenDecayPeriod ? this.daoSettings?.voiceTokenDecayPeriod : defaultSettings.voiceTokenDecayPeriod,
        voiceTokenDecayPerPeriod: this.daoSettings?.voiceTokenDecayPerPeriod ? this.daoSettings?.voiceTokenDecayPerPeriod : defaultSettings.voiceTokenDecayPerPeriod,
        // voiceDecayPeriod: this.daoSettings?.votingQuorumPercent ? this.daoSettings?.votingQuorumPercent : defaultSettings.votingQuorumPercent,
        // voiceDecayPercent: map(this.daoSettings.settings_voiceTokenDecayPerPeriodX10M_i, MIN_DECAY, MAX_DECAY, 0, 100)

        communityVotingEnabled: this.daoSettings?.communityVotingEnabled ? this.daoSettings?.communityVotingEnabled : defaultSettings.communityVotingEnabled,
        communityVotingDurationSec: this.daoSettings?.communityVotingDurationSec ? this.daoSettings?.communityVotingDurationSec : defaultSettings.communityVotingDurationSec,
        communityVotingAlignmentPercent: this.daoSettings?.communityVotingAlignmentPercent ? this.daoSettings?.communityVotingAlignmentPercent : defaultSettings.communityVotingAlignmentPercent,
        communityVotingQuorumPercent: this.daoSettings?.communityVotingQuorumPercent ? this.daoSettings?.communityVotingQuorumPercent : defaultSettings.communityVotingQuorumPercent,

        // TODO
        // communityVotingMethod: this.daoSettings?.communityVotingMethod ? this.daoSettings?.communityVotingMethod : defaultSettings.communityVotingMethod,
        // upvoteStartDateTime: this.daoSettings?.upvoteStartDateTime ? this.daoSettings?.upvoteStartDateTime : defaultSettings.upvoteStartDateTime,
        // upvoteStartDate: this.daoSettings?.upvoteStartDate ? this.daoSettings?.upvoteStartDate : defaultSettings.upvoteStartDate,
        // upvoteStartTime: this.daoSettings?.upvoteStartTime ? this.daoSettings?.upvoteStartTime : defaultSettings.upvoteStartTime,
        // upvoteDuration: this.daoSettings?.upvoteDuration ? this.daoSettings?.upvoteDuration : defaultSettings.upvoteDuration,
        // upvoteRounds: this.daoSettings?.upvoteRounds ? this.daoSettings?.upvoteRounds : defaultSettings.upvoteRounds,
        // upvoteCheifDelegateCount: this.daoSettings?.upvoteCheifDelegateCount ? this.daoSettings?.upvoteCheifDelegateCount : defaultSettings.upvoteCheifDelegateCount,
        // upvoteCheifDelegateDuration: this.daoSettings?.upvoteCheifDelegateDuration ? this.daoSettings?.upvoteCheifDelegateDuration : defaultSettings.upvoteCheifDelegateDuration,
        // upvoteHeadDelegateRound: this.daoSettings?.upvoteHeadDelegateRound ? this.daoSettings?.upvoteHeadDelegateRound : defaultSettings.upvoteHeadDelegateRound,
        // upvoteHeadDelegateDuration: this.daoSettings?.upvoteHeadDelegateDuration ? this.daoSettings?.upvoteHeadDelegateDuration : defaultSettings.upvoteHeadDelegateDuration,
        showUpvoteElection: this.daoSettings.showUpvoteElection ? this.daoSettings.showUpvoteElection : defaultSettings.showUpvoteElection
      }

      this.resetForm()
    },

    resetForm () {
      this.form = {
        ...this.initialForm
      }
    },

    async createMultisig () {
      try {
        this.state = CONFIGURATION_STATE.CREATE_MULTI_SIG

        await this.createSettingsMultisig({ data: { ...this.dataForSave } })

        this.initialForm = {
          ...this.form
        }

        this.state = CONFIGURATION_STATE.WAITING
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async cancelMultisig () {
      try {
        this.state = CONFIGURATION_STATE.SAVING
        await this.cancelSettingsMultisig({ id: this.activeMultisig.id })
        this.state = CONFIGURATION_STATE.WAITING
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async voteMultisig (approve) {
      try {
        this.state = CONFIGURATION_STATE.SAVING
        await this.voteSettingsMultisig({ id: this.activeMultisig.id, approve })
        this.state = CONFIGURATION_STATE.WAITING
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async executeMultisig () {
      try {
        this.state = CONFIGURATION_STATE.SAVING
        await this.executeSettingsMultisig({ id: this.activeMultisig.id })
        this.state = CONFIGURATION_STATE.WAITING
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async resetMultisig () {
      try {
        this.state = CONFIGURATION_STATE.SAVING
        this.resetForm()
        this.state = CONFIGURATION_STATE.WAITING
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async updateSettings () {
      try {
        this.state = CONFIGURATION_STATE.SAVING
        await this.updateDAOSettings({ data: { ...this.dataForSave } })

        const url = this.dataForSave.daoUrl
        if (url) {
          // If url changes reload page
          this.$router.push(`/${url}/configuration`)
        }

        // Set inital form to the new form
        this.initialForm = {
          ...this.form
        }

        this.state = CONFIGURATION_STATE.WAITING
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async importElection () {
      try {
        this.state = CONFIGURATION_STATE.SAVING
        await this.importEdenElection(this.selectedDao.docId)
        this.state = CONFIGURATION_STATE.WAITING
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    onChange (name, value) { this.$set(this.form, name, value) },

    onLeavePageConfirmed (answer) {
      this.state = CONFIGURATION_STATE.LEFT
      if (answer) {
        this.next()
      }
    },

    async onSave () {
      if (this.daoSettings.multisigEnabled) {
        this.state = CONFIGURATION_STATE.CREATE_MULTI_SIG
      } else {
        this.updateSettings()
      }
    }

  },

  computed: {
    ...mapGetters('accounts', ['account', 'isAdmin']),
    ...mapGetters('dao', ['daoAlerts', 'daoAnnouncements', 'daoSettings', 'daoSettingsMultisigs', 'isHypha', 'selectedDao', 'selectedDaoPlan']),

    activeMultisig () { return this.daoSettingsMultisigs ? this.daoSettingsMultisigs[0] : {} },
    hasActiveMultisig () { return this.daoSettingsMultisigs.length > 0 },
    hasSignedMultisig () { return this.activeMultisig ? !!this.activeMultisig?.approvedby?.find(_ => _.details_member_n === this.account) : false },
    isMultisigModalOpen () {
      return [
        CONFIGURATION_STATE.CREATE_MULTI_SIG,
        CONFIGURATION_STATE.SIGN_MULTI_SIG,
        CONFIGURATION_STATE.VIEW_MULTI_SIG
      ].includes(this.state)
    },

    multiSigState () {
      if (this.state === CONFIGURATION_STATE.CREATE_MULTI_SIG) return 'CREATE'
      if (this.state === CONFIGURATION_STATE.SIGN_MULTI_SIG) return 'SIGN'
      if (this.state === CONFIGURATION_STATE.VIEW_MULTI_SIG) return 'VIEW'

      return 'VIEW'
    },

    isLeaving () { return this.state === CONFIGURATION_STATE.LEAVING },

    dataForSave () { return settingsMapper(this.changedFields.reduce((acc, field) => ({ ...acc, [field]: this.form[field] }), {})) },

    changedFields () {
      const changed = []
      Object.keys(this.form).forEach(field => {
        const inital = this.initialForm[field]
        const current = this.form[field]

        if (Array.isArray(current)) {
          current.forEach(function (p, idx) {
            return Object.keys(p).forEach(function (prop) {
              if (!inital[idx]) {
                // changed.push(`${field}.${idx}.${prop}`)
                return
              }
              if (p[prop] !== inital[idx][prop]) {
                changed.push(`${field}.${idx}.${prop}`)
              }
            })
          })

          const lengthChange = Math.abs(inital.length - current.length)
          if (lengthChange > 0) { Array(lengthChange).fill(0).map(_ => changed.push(_)) }

          return
        }

        if (current !== inital) { changed.push(field) }
      })

      return changed
    },

    numberOfChanges () { return this.changedFields.length }
  },

  async mounted () {
    this.initForm()
  },

  async beforeRouteLeave (to, from, next) {
    this.next = next

    if (this.numberOfChanges > 0) {
      this.state = CONFIGURATION_STATE.LEAVING
    } else {
      next()
    }
  },

  watch: {
    '$route.query.tab': {
      handler: function (tab) {
        if (tab && TABS[tab]) {
          this.tab = TABS[tab]
        }

        this.$router.replace({ query: {} })
      },
      deep: true,
      immediate: true
    },

    daoSettings: { handler: function () { this.initForm() } }
  }
}
</script>

<template lang="pug">
q-page.page-configuration
  multisig-modal(
    v-bind="{ activeMultisig: activeMultisig ? activeMultisig : form, form: activeMultisig ? form : initialForm, isAdmin, isHypha }"
    :open="isMultisigModalOpen"
    :state="multiSigState"
    @close="state = CONFIGURATION_STATE.WAITING"
    @reset="resetMultisig"
    @create="createMultisig"
    @cancel="cancelMultisig"
    @vote="voteMultisig"
  )

  confirm-action-modal(
    v-model="isLeaving"
    @responded="onLeavePageConfirmed"
    :title="$t('configuration.alert.confirm-action')"
  )

  q-tabs(
    active-color="primary"
    align="left"
    indicator-color="primary"
    no-caps
    v-model="tab"
  )
    q-tab(:name="TABS.GENERAL" :label="$t('configuration.tabs.general')" :ripple="false")
    q-tab(:name="TABS.STRUCTURE" :label="$t('configuration.tabs.structure')" :ripple="false")
    q-tab(:name="TABS.TOKENS" :label="$t('configuration.tabs.tokens')" :ripple="false")
    q-tab(:name="TABS.VOTING" :label="$t('configuration.tabs.voting')" :ripple="false")

  settings-general(v-show="tab === TABS.GENERAL" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-structure(v-show="tab === TABS.STRUCTURE" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-tokens(v-show="tab === TABS.TOKENS" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-voting(v-show="tab === TABS.VOTING" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl

  //- NAVIGATION SETTINGS
  nav.full-width.q-my-xl.row.justify-end(v-show="isAdmin && !activeMultisig")
    q-btn.q-px-xl.rounded-border.text-bold.q-mr-xs(
      :class="{ 'full-width': !$q.screen.gt.sm }"
      :disable="numberOfChanges === 0"
      :label="$t('configuration.nav.reset')"
      @click="resetForm"
      color="white"
      no-caps
      rounded
      text-color="primary"
      unelevated
    )
    div.inline.relative-position(:class="{ 'full-width q-mt-md': !$q.screen.gt.sm }")
      q-btn.q-px-xl.rounded-border.text-bold.q-ml-xs.full-width(
        :disable="numberOfChanges === 0"
        :label="$t('configuration.nav.submit')"
        @click="onSave"
        color="primary"
        no-caps
        rounded
        unelevated
      )
      q-badge.notification-badge(:label="numberOfChanges" color="red" rounded size='10px' v-show="numberOfChanges > 0")

  //- NAVIGATION MULTISIG
  nav.full-width.q-my-xl.row.justify-end(v-show="isAdmin && activeMultisig")
    q-btn.q-px-xl.rounded-border.text-bold.q-mr-xs(
      :class="{ 'full-width': !$q.screen.gt.sm }"
      :label="$t('configuration.nav.view-multisig')"
      @click="state = CONFIGURATION_STATE.VIEW_MULTI_SIG"
      color="white"
      no-caps
      rounded
      text-color="primary"
      unelevated
    )
    div.inline.relative-position(:class="{ 'full-width q-mt-md': !$q.screen.gt.sm }")
      q-btn.q-px-xl.rounded-border.text-bold.q-ml-xs.full-width(
        :label="hasSignedMultisig ? $t('configuration.nav.execute-multisig') : $t('configuration.nav.sign-multisig')"
        @click="hasSignedMultisig ?  executeMultisig() : state = CONFIGURATION_STATE.SIGN_MULTI_SIG"
        color="primary"
        no-caps
        rounded
        unelevated
      )

</template>

<style lang="stylus" scoped>
</style>
