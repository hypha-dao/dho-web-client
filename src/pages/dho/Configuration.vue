<script>
import { mapActions, mapGetters } from 'vuex'

// const cloneDeep = value => JSON.parse(JSON.stringify(value))
const exist = value => value !== undefined

const settingsMapper = (data) => {
  // upvoteStartDate,
  // upvoteStartTime,
  // upvoteRounds,
  // const [timezoneHours, timezoneMinutes] = new Date().toString().match(/([-+][0-9]+)\s/)[1].match(/.{1,3}/g)

  const { name, purpose, url, ...form } = data || {}

  return {
    ...form,
    ...(exist(name) ? { daoTitle: name } : {}),
    ...(exist(purpose) ? { daoDescription: purpose } : {}),
    ...(exist(url) ? { daoUrl: url } : {}),

    ...(exist(form.proposalsCreationEnabled) ? { proposalsCreationEnabled: form.proposalsCreationEnabled ? 1 : 0 } : {}),
    // ...(exist(form.membersApplicationEnabled) ? { membersApplicationEnabled: form.membersApplicationEnabled ? 1 : 0 } : {}),
    // ...(exist(form.proposalsCreationEnabled) ? { removableBannersEnabled: form.removableBannersEnabled ? 1 : 0 } : {}),
    // ...(exist(form.multisigEnabled) ? { multisigEnabled: form.multisigEnabled ? 1 : 0 } : {}),

    ...(exist(form.votingAlignmentPercent) ? { votingAlignmentX100: form.votingAlignmentPercent } : {}),
    ...(exist(form.votingQuorumPercent) ? { votingQuorumX100: form.votingQuorumPercent } : {}),

    ...(exist(form.communityVotingEnabled) ? { communityVotingEnabled: form.communityVotingEnabled ? 1 : 0 } : {})
    // ...(exist(form.upvoteHeadDelegateRound) ? { upvoteHeadDelegateRound: form.upvoteHeadDelegateRound ? 1 : 0 } : {})

    // ...(exist(upvoteStartDate && upvoteStartTime) ? { upvoteStartDateTime: upvoteStartDate ? new Date(`${upvoteStartDate.replace(/\//g, '-')}T${upvoteStartTime}:00.000${timezoneHours}:${timezoneMinutes}`).toISOString().replace('Z', '') : '' } : {}),

    // ...(exist(upvoteRounds) ? { upvoteRounds: JSON.stringify(upvoteRounds) } : {})

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
  // GENERAL FORM
  logo: '',
  title: '',
  description: '',
  url: '',

  roles: [],
  levels: [],

  // VOTING FORM
  votingDurationSec: '',
  // periodDurationSec: '',
  votingAlignmentPercent: '',
  votingQuorumPercent: '',
  communityVotingEnabled: false,
  communityVotingDurationSec: 604800,
  communityVotingAlignmentPercent: 20,
  communityVotingQuorumPercent: 50,

  // ECONOMICS FORM
  // utilityTokenMultiplier: 1,
  // voiceTokenMultiplier: 2,
  // treasuryTokenMultiplier: 1,
  // voiceTokenDecayPeriod: '',

  communityVotingMethod: 'CLASSIC',
  upvoteStartDateTime: '',
  upvoteStartDate: '',
  upvoteStartTime: '',
  upvoteDuration: 7890000,
  upvoteRounds: [{ peoplePassing: 50, duration: 10800 }],
  upvoteCheifDelegateCount: 4,
  upvoteCheifDelegateDuration: 10800,
  upvoteHeadDelegateRound: false,
  upvoteHeadDelegateDuration: 10800,

  // COMMUNICATION FORM
  // announcements: [{ title: '', message: '', enabled: false }],
  // alerts: [{ level: 'positive', content: '', enabled: false }],

  // DESIGN FORM
  // general

  extendedLogo: '',
  primaryColor: '#242f5d',
  secondaryColor: '#3F64EE',
  textColor: '#ffffff',
  pattern: '',
  patternColor: '#3E3B46',
  patternOpacity: '30',
  patternBase64: ''

}

const TABS = Object.freeze({
  GENERAL: 'GENERAL',
  STRUCTURE: 'STRUCTURE',
  VOTING: 'VOTING'
})

export default {
  name: 'page-configuration',
  components: {
    ConfirmActionModal: () => import('~/components/common/confirm-action-modal.vue'),
    MultisigModal: () => import('~/components/dao/multisig-modal.vue'),

    SettingsGeneral: () => import('~/components/dao/settings-general.vue'),
    SettingsStructure: () => import('~/components/dao/settings-structure.vue'),
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
      'createSettingsMultisig', 'cancelSettingsMultisig', 'voteSettingsMultisig', 'executeSettingsMultisig'
    ]),

    initForm () {
      this.initialForm = {
        logo: this.daoSettings?.logo ? this.daoSettings?.logo : defaultSettings.logo,
        name: this.daoSettings?.title ? this.daoSettings?.title : defaultSettings.title,
        url: this.daoSettings?.url ? this.daoSettings?.url : defaultSettings.url,
        purpose: this.daoSettings?.description ? this.daoSettings?.description : defaultSettings.description,

        proposalsCreationEnabled: this.daoSettings?.proposalsCreationEnabled !== null ? this.daoSettings?.proposalsCreationEnabled : defaultSettings.proposalsCreationEnabled,
        votingDurationSec: this.daoSettings?.votingDurationSec ? this.daoSettings?.votingDurationSec : defaultSettings.votingDurationSec,
        periodDurationSec: this.daoSettings?.periodDurationSec ? this.daoSettings?.periodDurationSec : defaultSettings.periodDurationSec,
        votingAlignmentPercent: this.daoSettings?.votingAlignmentPercent ? this.daoSettings?.votingAlignmentPercent : defaultSettings.votingAlignmentPercent,
        votingQuorumPercent: this.daoSettings?.votingQuorumPercent ? this.daoSettings?.votingQuorumPercent : defaultSettings.votingQuorumPercent,

        communityVotingEnabled: this.daoSettings?.communityVotingEnabled ? this.daoSettings?.communityVotingEnabled : defaultSettings.communityVotingEnabled,
        communityVotingDurationSec: this.daoSettings?.communityVotingDurationSec ? this.daoSettings?.communityVotingDurationSec : defaultSettings.communityVotingDurationSec,
        communityVotingAlignmentPercent: this.daoSettings?.communityVotingAlignmentPercent ? this.daoSettings?.communityVotingAlignmentPercent : defaultSettings.communityVotingAlignmentPercent,
        communityVotingQuorumPercent: this.daoSettings?.communityVotingQuorumPercent ? this.daoSettings?.communityVotingQuorumPercent : defaultSettings.communityVotingQuorumPercent,

        // membersApplicationEnabled: this.daoSettings?.membersApplicationEnabled !== null ? this.daoSettings?.membersApplicationEnabled : defaultSettings.membersApplicationEnabled,
        // removableBannersEnabled: this.daoSettings?.removableBannersEnabled !== null ? this.daoSettings?.removableBannersEnabled : defaultSettings.removableBannersEnabled,
        // multisigEnabled: this.daoSettings?.multisigEnabled !== null ? this.daoSettings?.multisigEnabled : defaultSettings.multisigEnabled,
        // socialChat: this.daoSettings?.socialChat ? this.daoSettings?.socialChat : defaultSettings.socialChat,
        // documentationURL: this.daoSettings?.documentationURL ? this.daoSettings?.documentationURL : defaultSettings.documentationURL,
        // documentationButtonText: this.daoSettings?.documentationButtonText ? this.daoSettings?.documentationButtonText : defaultSettings.documentationButtonText,

        // roles: this.daoSettings?.roles ? this.daoSettings?.roles : defaultSettings.roles,
        levels: this.daoSettings?.levels ? this.daoSettings?.levels : defaultSettings.levels,

        // utilityTokenMultiplier: this.daoSettings?.utilityTokenMultiplier ? this.daoSettings?.utilityTokenMultiplier : defaultSettings.utilityTokenMultiplier,
        // voiceTokenMultiplier: this.daoSettings?.voiceTokenMultiplier ? this.daoSettings?.voiceTokenMultiplier : defaultSettings.voiceTokenMultiplier,
        // treasuryTokenMultiplier: this.daoSettings?.treasuryTokenMultiplier ? this.daoSettings?.treasuryTokenMultiplier : defaultSettings.treasuryTokenMultiplier,
        // voiceTokenDecayPeriod: this.daoSettings?.voiceTokenDecayPeriod ? this.daoSettings?.voiceTokenDecayPeriod : defaultSettings.voiceTokenDecayPeriod,

        // salaries: cloneDeep([...(this.daoSettings?.salaries ? this.daoSettings?.salaries : defaultSettings.salaries)]),

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

        extendedLogo: this?.daoSettings?.extendedLogo ? this?.daoSettings?.extendedLogo : defaultSettings.extendedLogo,
        primaryColor: this.daoSettings?.primaryColor ? this.daoSettings?.primaryColor : defaultSettings.primaryColor,
        secondaryColor: this.daoSettings?.secondaryColor ? this.daoSettings?.secondaryColor : defaultSettings.secondaryColor,
        textColor: this.daoSettings?.textColor ? this.daoSettings?.textColor : defaultSettings.textColor
        // pattern: this.daoSettings?.pattern ? this.daoSettings?.pattern : defaultSettings.pattern,
        // patternColor: this.daoSettings?.patternColor ? this.daoSettings?.patternColor : defaultSettings.patternColor,
        // patternOpacity: this.daoSettings?.patternOpacity ? this.daoSettings?.patternOpacity : defaultSettings.patternOpacity,
        // patternBase64: this.daoSettings?.patternBase64 ? this.daoSettings?.patternBase64 : defaultSettings.patternBase64,

      }

      this.form = {
        ...this.initialForm
        // salaries: cloneDeep([...(this.daoSettings?.salaries ? this.daoSettings?.salaries : defaultSettings.salaries)]),
        // alerts: cloneDeep([...(this.daoAlerts && this.daoAlerts.length > 0 ? this.daoAlerts : defaultSettings.alerts)]),
        // announcements: cloneDeep([...(this.daoAnnouncements && this.daoAnnouncements.length > 0 ? this.daoAnnouncements : defaultSettings.announcements)])
      }
    },

    resetForm () {
      this.form = {
        ...this.initialForm
      }
    },

    async createMultisig () {
      try {
        this.state = CONFIGURATION_STATE.CREATE_MULTI_SIG

        await this.createSettingsMultisig({
          docId: this.selectedDao.docId,
          data: settingsMapper(this.dataForSave)
        })

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

        await this.updateDAOSettings({
          docId: this.selectedDao.docId,
          data: { ...this.dataForSave }
        })

        const url = this.dataForSave.daoUrl
        if (url) {
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
      this.updateSettings()
      // if (this.daoSettings.multisigEnabled) {
      //   this.state = CONFIGURATION_STATE.CREATE_MULTI_SIG
      // } else {
      //   this.updateSettings()
      // }
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

  updated () {
    console.log(JSON.stringify(this.form.votingDurationSec))
  },

  watch: {
    '$route.query.tab': {
      handler: function (tab) {
        if (tab && this.tabs[tab]) {
          this.tab = tab
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
    title="Are you sure you want to leave without saving your draft?"
  )

  q-tabs(
    active-color="primary"
    align="start"
    indicator-color="primary"
    no-caps
    v-model="tab"
  )
    q-tab(:name="TABS.GENERAL" label="General" :ripple="false")
    q-tab(:name="TABS.STRUCTURE" label="Structure" :ripple="false")
    q-tab(:name="TABS.VOTING" label="Voting" :ripple="false")

  settings-general(v-show="tab === TABS.GENERAL" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-structure(v-show="tab === TABS.STRUCTURE" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-voting(v-show="tab === TABS.VOTING" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl

  //- NAVIGATION SETTINGS
  nav.full-width.q-my-xl.row.justify-end(v-show="isAdmin && !activeMultisig")
    q-btn.q-px-xl.rounded-border.text-bold.q-mr-xs(
      :class="{ 'full-width': !$q.screen.gt.sm }"
      :disable="numberOfChanges === 0"
      @click="resetForm"
      color="white"
      label="Reset changes"
      no-caps
      rounded
      text-color="primary"
      unelevated
    )
    div.inline.relative-position(:class="{ 'full-width q-mt-md': !$q.screen.gt.sm }")
      q-btn.q-px-xl.rounded-border.text-bold.q-ml-xs.full-width(
        :disable="numberOfChanges === 0"
        @click="onSave"
        color="primary"
        label="Save changes"
        no-caps
        rounded
        unelevated
      )
      q-badge.notification-badge(:label="numberOfChanges" color="red" rounded size='10px' v-show="numberOfChanges > 0")

  //- NAVIGATION MULTISIG
  nav.full-width.q-my-xl.row.justify-end(v-show="isAdmin && activeMultisig")
    q-btn.q-px-xl.rounded-border.text-bold.q-mr-xs(
      :class="{ 'full-width': !$q.screen.gt.sm }"
      @click="state = CONFIGURATION_STATE.VIEW_MULTI_SIG"
      color="white"
      label="View multisig"
      no-caps
      rounded
      text-color="primary"
      unelevated
    )
    div.inline.relative-position(:class="{ 'full-width q-mt-md': !$q.screen.gt.sm }")
      q-btn.q-px-xl.rounded-border.text-bold.q-ml-xs.full-width(
        @click="hasSignedMultisig ?  executeMultisig() : state = CONFIGURATION_STATE.SIGN_MULTI_SIG"
        color="primary"
        :label="hasSignedMultisig ? 'Execute multisig' : 'Sign multisig'"
        no-caps
        rounded
        unelevated
      )

</template>

<style lang="stylus" scoped>
</style>
