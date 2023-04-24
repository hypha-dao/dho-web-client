<script>
import { mapActions, mapGetters } from 'vuex'
// import { toHTML } from '~/utils/turndown'
import { diff } from '~/utils/diff'

const cloneDeep = value => JSON.parse(JSON.stringify(value))

/*!
 * Find the differences between two objects and push to a new object
 * (c) 2019 Chris Ferdinandi & Jascha Brinkmann, MIT License, https://gomakethings.com & https://twitter.com/jaschaio
 * @param  {Object} obj1 The original object
 * @param  {Object} obj2 The object to compare against it
 * @return {Object}      An object of differences between the two
 */

const defaultSettings = {
  // GENERAL FORM
  title: '',
  url: '',
  proposalsCreationEnabled: true,
  membersApplicationEnabled: true,
  removableBannersEnabled: true,
  socialChat: '',
  documentationButtonText: '',
  documentationURL: '',

  // VOTING FORM
  votingDurationSec: '',
  // periodDurationSec: '',
  votingAlignmentPercent: '',
  votingQuorumPercent: '',

  // ECONOMICS FORM
  // utilityTokenMultiplier: 1,
  // voiceTokenMultiplier: 2,
  // treasuryTokenMultiplier: 1,
  // voiceTokenDecayPeriod: '',

  // salaries: [{ name: 'Band 1', value: 0 }],

  communityVotingEnabled: false,
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
  communityVotingDurationSec: 604800,
  communityVotingAlignmentPercent: 20,
  communityVotingQuorumPercent: 50,

  // COMMUNICATION FORM
  announcements: [{ title: '', message: '', enabled: false }],
  alerts: [{ level: 'positive', content: '', enabled: false }],

  // DESIGN FORM
  // general
  logo: '',
  extendedLogo: '',
  primaryColor: '#242f5d',
  secondaryColor: '#3F64EE',
  textColor: '#ffffff',
  pattern: '',
  patternColor: '#3E3B46',
  patternOpacity: '30',
  patternBase64: '',

  // splashpage
  splashBackgroundImage: '',

  // banners
  dashboardBackgroundImage: '',
  dashboardTitle: '',
  dashboardParagraph: '',

  proposalsBackgroundImage: '',
  proposalsTitle: '',
  proposalsParagraph: '',

  membersBackgroundImage: '',
  membersTitle: '',
  membersParagraph: '',

  organisationBackgroundImage: '',
  organisationTitle: '',
  organisationParagraph: '',

  exploreBackgroundImage: '',
  exploreTitle: '',
  exploreParagraph: ''

}

const CONFIGURATION_STATE = Object.freeze({
  WAITING: 'WAITING',
  SAVING: 'SAVING',
  CREATE_MULTI_SIG: 'CREATE_MULTI_SIG',
  SIGN_MULTI_SIG: 'SIGN_MULTI_SIG',
  VIEW_MULTI_SIG: 'VIEW_MULTI_SIG',
  CONFIRM_LEAVE_PAGE: 'CONFIRM_LEAVE_PAGE'
})

const tabs = Object.freeze({
  GENERAL: 'GENERAL',
  VOTING: 'VOTING',
  COMMUNITY: 'COMMUNITY',
  COMMUNICATION: 'COMMUNICATION',
  DESIGN: 'DESIGN',
  PLAN: 'PLAN'
})

export default {
  name: 'page-configuration',
  components: {
    ConfirmActionModal: () => import('~/components/common/confirm-action-modal.vue'),

    MultisigModal: () => import('~/components/dao/multisig-modal.vue'),

    SettingsGeneral: () => import('~/components/dao/settings-general.vue'),
    SettingsVoting: () => import('~/components/dao/settings-voting.vue'),
    SettingsCommunity: () => import('~/components/dao/settings-community.vue'),
    SettingsCommunication: () => import('~/components/dao/settings-communication.vue'),
    SettingsDesign: () => import('~/components/dao/settings-design.vue'),
    SettingsPlan: () => import('~/components/dao/settings-plan.vue')

  },

  data () {
    return {
      CONFIGURATION_STATE,

      confirmLeavePage: null,

      form: {},
      initialForm: {},

      state: '',

      tab: tabs.GENERAL,
      tabs
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
        title: this.daoSettings?.title ? this.daoSettings?.title : defaultSettings.title,
        url: this.daoSettings?.url ? this.daoSettings?.url : defaultSettings.url,
        proposalsCreationEnabled: this.daoSettings?.proposalsCreationEnabled !== null ? this.daoSettings?.proposalsCreationEnabled : defaultSettings.proposalsCreationEnabled,
        membersApplicationEnabled: this.daoSettings?.membersApplicationEnabled !== null ? this.daoSettings?.membersApplicationEnabled : defaultSettings.membersApplicationEnabled,
        removableBannersEnabled: this.daoSettings?.removableBannersEnabled !== null ? this.daoSettings?.removableBannersEnabled : defaultSettings.removableBannersEnabled,
        socialChat: this.daoSettings?.socialChat ? this.daoSettings?.socialChat : defaultSettings.socialChat,
        documentationURL: this.daoSettings?.documentationURL ? this.daoSettings?.documentationURL : defaultSettings.documentationURL,
        documentationButtonText: this.daoSettings?.documentationButtonText ? this.daoSettings?.documentationButtonText : defaultSettings.documentationButtonText,

        votingDurationSec: this.daoSettings?.votingDurationSec ? this.daoSettings?.votingDurationSec : defaultSettings.votingDurationSec,
        // periodDurationSec: this.daoSettings?.periodDurationSec ? this.daoSettings?.periodDurationSec : defaultSettings.periodDurationSec,
        votingAlignmentPercent: this.daoSettings?.votingAlignmentPercent ? this.daoSettings?.votingAlignmentPercent : defaultSettings.votingAlignmentPercent,
        votingQuorumPercent: this.daoSettings?.votingQuorumPercent ? this.daoSettings?.votingQuorumPercent : defaultSettings.votingQuorumPercent,

        // utilityTokenMultiplier: this.daoSettings?.utilityTokenMultiplier ? this.daoSettings?.utilityTokenMultiplier : defaultSettings.utilityTokenMultiplier,
        // voiceTokenMultiplier: this.daoSettings?.voiceTokenMultiplier ? this.daoSettings?.voiceTokenMultiplier : defaultSettings.voiceTokenMultiplier,
        // treasuryTokenMultiplier: this.daoSettings?.treasuryTokenMultiplier ? this.daoSettings?.treasuryTokenMultiplier : defaultSettings.treasuryTokenMultiplier,
        // voiceTokenDecayPeriod: this.daoSettings?.voiceTokenDecayPeriod ? this.daoSettings?.voiceTokenDecayPeriod : defaultSettings.voiceTokenDecayPeriod,

        // salaries: cloneDeep([...(this.daoSettings?.salaries ? this.daoSettings?.salaries : defaultSettings.salaries)]),

        communityVotingEnabled: this.daoSettings?.communityVotingEnabled ? this.daoSettings?.communityVotingEnabled : defaultSettings.communityVotingEnabled,
        communityVotingMethod: this.daoSettings?.communityVotingMethod ? this.daoSettings?.communityVotingMethod : defaultSettings.communityVotingMethod,
        upvoteStartDateTime: this.daoSettings?.upvoteStartDateTime ? this.daoSettings?.upvoteStartDateTime : defaultSettings.upvoteStartDateTime,
        upvoteStartDate: this.daoSettings?.upvoteStartDate ? this.daoSettings?.upvoteStartDate : defaultSettings.upvoteStartDate,
        upvoteStartTime: this.daoSettings?.upvoteStartTime ? this.daoSettings?.upvoteStartTime : defaultSettings.upvoteStartTime,
        upvoteDuration: this.daoSettings?.upvoteDuration ? this.daoSettings?.upvoteDuration : defaultSettings.upvoteDuration,
        upvoteRounds: this.daoSettings?.upvoteRounds ? this.daoSettings?.upvoteRounds : defaultSettings.upvoteRounds,
        upvoteCheifDelegateCount: this.daoSettings?.upvoteCheifDelegateCount ? this.daoSettings?.upvoteCheifDelegateCount : defaultSettings.upvoteCheifDelegateCount,
        upvoteCheifDelegateDuration: this.daoSettings?.upvoteCheifDelegateDuration ? this.daoSettings?.upvoteCheifDelegateDuration : defaultSettings.upvoteCheifDelegateDuration,
        upvoteHeadDelegateRound: this.daoSettings?.upvoteHeadDelegateRound ? this.daoSettings?.upvoteHeadDelegateRound : defaultSettings.upvoteHeadDelegateRound,
        upvoteHeadDelegateDuration: this.daoSettings?.upvoteHeadDelegateDuration ? this.daoSettings?.upvoteHeadDelegateDuration : defaultSettings.upvoteHeadDelegateDuration,
        communityVotingDurationSec: this.daoSettings?.communityVotingDurationSec ? this.daoSettings?.communityVotingDurationSec : defaultSettings.communityVotingDurationSec,
        communityVotingAlignmentPercent: this.daoSettings?.communityVotingAlignmentPercent ? this.daoSettings?.communityVotingAlignmentPercent : defaultSettings.communityVotingAlignmentPercent,
        communityVotingQuorumPercent: this.daoSettings?.communityVotingQuorumPercent ? this.daoSettings?.communityVotingQuorumPercent : defaultSettings.communityVotingQuorumPercent,

        alerts: cloneDeep([...(this.daoAlerts && this.daoAlerts.length > 0 ? this.daoAlerts : defaultSettings.alerts)]),
        announcements: cloneDeep([...(this.daoAnnouncements && this.daoAnnouncements.length > 0 ? this.daoAnnouncements : defaultSettings.announcements)]),

        logo: this.daoSettings?.logo ? this.daoSettings?.logo : defaultSettings.logo,
        extendedLogo: this?.daoSettings?.extendedLogo ? this?.daoSettings?.extendedLogo : defaultSettings.extendedLogo,
        primaryColor: this.daoSettings?.primaryColor ? this.daoSettings?.primaryColor : defaultSettings.primaryColor,
        secondaryColor: this.daoSettings?.secondaryColor ? this.daoSettings?.secondaryColor : defaultSettings.secondaryColor,
        textColor: this.daoSettings?.textColor ? this.daoSettings?.textColor : defaultSettings.textColor,
        pattern: this.daoSettings?.pattern ? this.daoSettings?.pattern : defaultSettings.pattern,
        patternColor: this.daoSettings?.patternColor ? this.daoSettings?.patternColor : defaultSettings.patternColor,
        patternOpacity: this.daoSettings?.patternOpacity ? this.daoSettings?.patternOpacity : defaultSettings.patternOpacity,
        patternBase64: this.daoSettings?.patternBase64 ? this.daoSettings?.patternBase64 : defaultSettings.patternBase64,

        splashBackgroundImage: this.daoSettings?.splashBackgroundImage ? this.daoSettings?.splashBackgroundImage : defaultSettings.splashBackgroundImage,

        dashboardBackgroundImage: this.daoSettings?.dashboardBackgroundImage ? this.daoSettings?.dashboardBackgroundImage : defaultSettings.dashboardBackgroundImage,
        dashboardTitle: this.daoSettings?.dashboardTitle ? this.daoSettings?.dashboardTitle : defaultSettings.dashboardTitle,
        dashboardParagraph: this.daoSettings?.dashboardParagraph ? this.daoSettings?.dashboardParagraph : defaultSettings.dashboardParagraph,

        proposalsBackgroundImage: this.daoSettings?.proposalsBackgroundImage ? this.daoSettings?.proposalsBackgroundImage : defaultSettings.proposalsBackgroundImage,
        proposalsTitle: this.daoSettings?.proposalsTitle ? this.daoSettings?.proposalsTitle : defaultSettings.proposalsTitle,
        proposalsParagraph: this.daoSettings?.proposalsParagraph ? this.daoSettings?.proposalsParagraph : defaultSettings.proposalsParagraph,

        membersBackgroundImage: this.daoSettings?.membersBackgroundImage ? this.daoSettings?.membersBackgroundImage : defaultSettings.membersBackgroundImage,
        membersTitle: this.daoSettings?.membersTitle ? this.daoSettings?.membersTitle : defaultSettings.membersTitle,
        membersParagraph: this.daoSettings?.membersParagraph ? this.daoSettings?.membersParagraph : defaultSettings.membersParagraph,

        organisationBackgroundImage: this.daoSettings?.organisationBackgroundImage ? this.daoSettings?.organisationBackgroundImage : defaultSettings.organisationBackgroundImage,
        organisationTitle: this.daoSettings?.organisationTitle ? this.daoSettings?.organisationTitle : defaultSettings.organisationTitle,
        organisationParagraph: this.daoSettings?.organisationParagraph ? this.daoSettings?.organisationParagraph : defaultSettings.organisationParagraph,

        exploreBackgroundImage: this.daoSettings?.exploreBackgroundImage ? this.daoSettings?.exploreBackgroundImage : defaultSettings.exploreBackgroundImage,
        exploreTitle: this.daoSettings?.exploreTitle ? this.daoSettings?.exploreTitle : defaultSettings.exploreTitle,
        exploreParagraph: this.daoSettings?.exploreParagraph ? this.daoSettings?.exploreParagraph : defaultSettings.exploreParagraph

      }

      this.form = {
        ...this.initialForm,
        // salaries: cloneDeep([...(this.daoSettings?.salaries ? this.daoSettings?.salaries : defaultSettings.salaries)]),
        alerts: cloneDeep([...(this.daoAlerts && this.daoAlerts.length > 0 ? this.daoAlerts : defaultSettings.alerts)]),
        announcements: cloneDeep([...(this.daoAnnouncements && this.daoAnnouncements.length > 0 ? this.daoAnnouncements : defaultSettings.announcements)])
      }
    },

    resetForm () {
      this.form = {
        ...this.initialForm,
        // salaries: cloneDeep([...this.initialForm.salaries]),
        alerts: cloneDeep([...this.initialForm.alerts]),
        announcements: cloneDeep([...this.initialForm.announcements])
      }
    },

    async createMultisig () {
      this.state = CONFIGURATION_STATE.CREATE_MULTI_SIG
      // const diffrence = diff(this.initForm, this.form)

      // try {
      //   const {
      //     title,
      //     url,
      //     upvoteStartDate,
      //     upvoteStartTime,
      //     upvoteRounds,
      //     ...form
      //   } = this.form

      //   /* TODO: Detect and send only changed field
      //            Every field that you send to the action will be updated
      //   */
      //   const hasURLChanged = this.form.url !== this.initialForm.url

      //   const [timezoneHours, timezoneMinutes] = new Date().toString().match(/([-+][0-9]+)\s/)[1].match(/.{1,3}/g)

      //   const data = {
      //     docId: this.selectedDao.docId,
      //     data: {
      //       // ...form,

      //       title: this.form.title ? this.form.title : defaultSettings.title,
      //       url: this.form.url ? this.form.url : defaultSettings.url,
      //       socialChat: this.form.socialChat ? this.form.socialChat : defaultSettings.socialChat,
      //       documentationURL: this.form.documentationURL ? this.form.documentationURL : defaultSettings.documentationURL,
      //       documentationButtonText: this.form.documentationButtonText ? this.form.documentationButtonText : defaultSettings.documentationButtonText,

      //       votingDurationSec: this.form.votingDurationSec ? this.form.votingDurationSec : defaultSettings.votingDurationSec,
      //       // periodDurationSec: this.form.periodDurationSec ? this.form.periodDurationSec : defaultSettings.periodDurationSec,
      //       votingAlignmentPercent: this.form.votingAlignmentPercent ? this.form.votingAlignmentPercent : defaultSettings.votingAlignmentPercent,
      //       votingQuorumPercent: this.form.votingQuorumPercent ? this.form.votingQuorumPercent : defaultSettings.votingQuorumPercent,

      //       // utilityTokenMultiplier: this.form.utilityTokenMultiplier ? this.form.utilityTokenMultiplier : defaultSettings.utilityTokenMultiplier,
      //       // voiceTokenMultiplier: this.form.voiceTokenMultiplier ? this.form.voiceTokenMultiplier : defaultSettings.voiceTokenMultiplier,
      //       // treasuryTokenMultiplier: this.form.treasuryTokenMultiplier ? this.form.treasuryTokenMultiplier : defaultSettings.treasuryTokenMultiplier,
      //       // voiceTokenDecayPeriod: this.form.voiceTokenDecayPeriod ? this.form.voiceTokenDecayPeriod : defaultSettings.voiceTokenDecayPeriod,

      //       // salaries: cloneDeep([...(this.form.salaries ? this.form.salaries : defaultSettings.salaries)]),

      //       communityVotingEnabled: form.communityVotingEnabled ? 1 : 0,
      //       communityVotingMethod: this.form.communityVotingMethod ? this.form.communityVotingMethod : defaultSettings.communityVotingMethod,
      //       upvoteStartDateTime: upvoteStartDate ? new Date(`${upvoteStartDate.replace(/\//g, '-')}T${upvoteStartTime}:00.000${timezoneHours}:${timezoneMinutes}`).toISOString().replace('Z', '') : '',
      //       upvoteDuration: this.form.upvoteDuration ? this.form.upvoteDuration : defaultSettings.upvoteDuration,
      //       upvoteRounds: JSON.stringify(upvoteRounds),
      //       upvoteCheifDelegateCount: this.form.upvoteCheifDelegateCount ? this.form.upvoteCheifDelegateCount : defaultSettings.upvoteCheifDelegateCount,
      //       upvoteCheifDelegateDuration: this.form.upvoteCheifDelegateDuration ? this.form.upvoteCheifDelegateDuration : defaultSettings.upvoteCheifDelegateDuration,
      //       upvoteHeadDelegateRound: form.upvoteHeadDelegateRound ? 1 : 0,
      //       upvoteHeadDelegateDuration: this.form.upvoteHeadDelegateDuration ? this.form.upvoteHeadDelegateDuration : defaultSettings.upvoteHeadDelegateDuration,
      //       communityVotingDurationSec: this.form.communityVotingDurationSec ? this.form.communityVotingDurationSec : defaultSettings.communityVotingDurationSec,
      //       communityVotingAlignmentPercent: this.form.communityVotingAlignmentPercent ? this.form.communityVotingAlignmentPercent : defaultSettings.communityVotingAlignmentPercent,
      //       communityVotingQuorumPercent: this.form.communityVotingQuorumPercent ? this.form.communityVotingQuorumPercent : defaultSettings.communityotingQuorumPercent,

      //       logo: this.form.logo ? this.form.logo : defaultSettings.logo,
      //       extendedLogo: this?.daoSettings?.extendedLogo ? this?.daoSettings?.extendedLogo : defaultSettings.extendedLogo,
      //       primaryColor: this.form.primaryColor ? this.form.primaryColor : defaultSettings.primaryColor,
      //       secondaryColor: this.form.secondaryColor ? this.form.secondaryColor : defaultSettings.secondaryColor,
      //       textColor: this.form.textColor ? this.form.textColor : defaultSettings.textColor,
      //       pattern: this.form.pattern ? this.form.pattern : defaultSettings.pattern,
      //       patternColor: this.form.patternColor ? this.form.patternColor : defaultSettings.patternColor,
      //       patternOpacity: this.form.patternOpacity ? this.form.patternOpacity : defaultSettings.patternOpacity,
      //       patternBase64: this.form.patternBase64 ? this.form.patternBase64 : defaultSettings.patternBase64,

      //       splashBackgroundImage: this.form.splashBackgroundImage ? this.form.splashBackgroundImage : defaultSettings.splashBackgroundImage,

      //       dashboardBackgroundImage: this.form.dashboardBackgroundImage ? this.form.dashboardBackgroundImage : defaultSettings.dashboardBackgroundImage,
      //       dashboardTitle: this.form.dashboardTitle ? this.form.dashboardTitle : defaultSettings.dashboardTitle,
      //       dashboardParagraph: this.form.dashboardParagraph ? this.form.dashboardParagraph : defaultSettings.dashboardParagraph,

      //       proposalsBackgroundImage: this.form.proposalsBackgroundImage ? this.form.proposalsBackgroundImage : defaultSettings.proposalsBackgroundImage,
      //       proposalsTitle: this.form.proposalsTitle ? this.form.proposalsTitle : defaultSettings.proposalsTitle,
      //       proposalsParagraph: this.form.proposalsParagraph ? this.form.proposalsParagraph : defaultSettings.proposalsParagraph,

      //       membersBackgroundImage: this.form.membersBackgroundImage ? this.form.membersBackgroundImage : defaultSettings.membersBackgroundImage,
      //       membersTitle: this.form.membersTitle ? this.form.membersTitle : defaultSettings.membersTitle,
      //       membersParagraph: this.form.membersParagraph ? this.form.membersParagraph : defaultSettings.membersParagraph,

      //       organisationBackgroundImage: this.form.organisationBackgroundImage ? this.form.organisationBackgroundImage : defaultSettings.organisationBackgroundImage,
      //       organisationTitle: this.form.organisationTitle ? this.form.organisationTitle : defaultSettings.organisationTitle,
      //       organisationParagraph: this.form.organisationParagraph ? this.form.organisationParagraph : defaultSettings.organisationParagraph,

      //       exploreBackgroundImage: this.form.exploreBackgroundImage ? this.form.exploreBackgroundImage : defaultSettings.exploreBackgroundImage,
      //       exploreTitle: this.form.exploreTitle ? this.form.exploreTitle : defaultSettings.exploreTitle,
      //       exploreParagraph: this.form.exploreParagraph ? this.form.exploreParagraph : defaultSettings.exploreParagraph,

      //       daoTitle: title,
      //       ...(hasURLChanged ? { daoUrl: url } : {}),
      //       proposalsCreationEnabled: form.proposalsCreationEnabled ? 1 : 0,
      //       membersApplicationEnabled: form.membersApplicationEnabled ? 1 : 0,
      //       removableBannersEnabled: form.removableBannersEnabled ? 1 : 0,

      //       votingAlignmentX100: form.votingAlignmentPercent,
      //       votingQuorumX100: form.votingQuorumPercent

      //       // msig_approval_amount: 1
      //     }
      //   }

      //   // this.state = CONFIGURATION_STATE.CREATE_MULTI_SIG

      //   await this.createSettingsMultisig(data)

      //   this.state = CONFIGURATION_STATE.WAITING

      //   this.initialForm = {
      //     ...this.form
      //   }
      // } catch (e) {
      //   const message = e.message || e.cause.message
      //   this.showNotification({ message, color: 'red' })
      // }
    },

    async cancelMultisig () {
      // this.state = CONFIGURATION_STATE.SAVING
      await this.cancelSettingsMultisig({ id: this.activeMultisig.id })
      // this.state = CONFIGURATION_STATE.WAITING
    },

    async voteMultisig (approve) {
      this.state = CONFIGURATION_STATE.SAVING
      await this.voteSettingsMultisig({ id: this.activeMultisig.id, approve })
      this.state = CONFIGURATION_STATE.WAITING
    },

    async executeMultisig () {
      this.state = CONFIGURATION_STATE.SAVING
      await this.executeSettingsMultisig({ id: this.activeMultisig.id })
      this.state = CONFIGURATION_STATE.WAITING
    },

    resetMultisig () {
      this.resetForm()
      this.state = CONFIGURATION_STATE.WAITING
    },

    async saveSettings () {
      // TODO: Decide how to proceeed with multisig feature
      // this.state = CONFIGURATION_STATE.CREATE_MULTI_SIG

      try {
        const {
          alerts,
          announcements,
          title,
          url,
          upvoteStartDate,
          upvoteStartTime,
          upvoteRounds,
          ...form
        } = this.form

        const _alerts = this.isHypha ? [...alerts.filter(_ => _.title)] : []

        const alertsForCreate = _alerts.filter((_) => !_?.id)
        const alertsForUpdate = _alerts.filter(
          (_) => _?.id && this.initialForm.alerts.map(_ => _.id)?.includes(_?.id)
        )
        const alertsForDelete = this.initialForm.alerts.filter(
          (_) => _?.id && !_alerts.map(_ => _.id)?.includes(_?.id)
        )

        const _announcements = announcements.filter(_ => _.title !== '').map(_ => ({
          ..._,
          message: toHTML(_.message)
        }))

        const announcementsForCreate = _announcements.filter((_) => !_?.id)
        const announcementsForUpdate = _announcements.filter(
          (_) => _?.id && this.initialForm.announcements.map(_ => _.id)?.includes(_?.id)
        )
        const announcementsForDelete = this.initialForm.announcements.filter(
          (_) => _?.id && !_announcements.map(_ => _.id)?.includes(_?.id)
        )
        /* TODO: Detect and send only changed field
                 Every field that you send to the action will be updated
        */
        const hasURLChanged = this.form.url !== this.initialForm.url

        const [timezoneHours, timezoneMinutes] = new Date().toString().match(/([-+][0-9]+)\s/)[1].match(/.{1,3}/g)

        const data = {
          docId: this.selectedDao.docId,
          data: {
            ...form,
            daoTitle: title,
            ...(hasURLChanged ? { daoUrl: url } : {}),
            proposalsCreationEnabled: form.proposalsCreationEnabled ? 1 : 0,
            membersApplicationEnabled: form.membersApplicationEnabled ? 1 : 0,
            removableBannersEnabled: form.removableBannersEnabled ? 1 : 0,

            votingAlignmentX100: form.votingAlignmentPercent,
            votingQuorumX100: form.votingQuorumPercent,

            communityVotingEnabled: form.communityVotingEnabled ? 1 : 0,
            upvoteHeadDelegateRound: form.upvoteHeadDelegateRound ? 1 : 0,
            // TODO: Refactor to the util function
            upvoteStartDateTime: upvoteStartDate ? new Date(`${upvoteStartDate.replace(/\//g, '-')}T${upvoteStartTime}:00.000${timezoneHours}:${timezoneMinutes}`).toISOString().replace('Z', '') : '',
            upvoteRounds: JSON.stringify(upvoteRounds)
          },
          alerts: {
            created: alertsForCreate,
            updated: alertsForUpdate,
            deleted: alertsForDelete
          },
          announcements: {
            created: announcementsForCreate,
            updated: announcementsForUpdate,
            deleted: announcementsForDelete
          }
        }

        await this.updateDAOSettings(data)

        if (hasURLChanged) {
          setTimeout(() => this.$router.push(`/${this.form.url}/configuration`), 300)
        }

        this.initialForm = {
          ...this.form,
          // salaries: cloneDeep([...this.form.salaries]),
          alerts: cloneDeep([...this.form.alerts]),
          announcements: cloneDeep([...this.form.announcements])
        }
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async importElection () {
      try {
        await this.importEdenElection(this.selectedDao.docId)
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    onChange (name, value) { this.$set(this.form, name, value) },

    onLeavePageConfirmed (answer) {
      this.confirmLeavePage = false
      if (answer) {
        this.next()
      }
    }

  },

  computed: {
    ...mapGetters('accounts', ['account', 'isAdmin']),
    ...mapGetters('dao', ['daoAlerts', 'daoAnnouncements', 'daoSettings', 'daoSettingsMultisigs', 'isHypha', 'selectedDao', 'selectedDaoPlan']),

    activeMultisig () { return this.daoSettingsMultisigs ? this.daoSettingsMultisigs[0] : {} },
    hasActiveMultisig () { return this.daoSettingsMultisigs.length > 0 },
    hasSignedMultisig () { return this.activeMultisig ? !!this.activeMultisig.approvedby.find(_ => _.details_member_n === this.account) : false },
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
      // EXECUTE: 'CREATE_MULTI_SIG',
    },

    numberOfChanges () {
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

      return changed.length
    }
  },

  async mounted () {
    this.initForm()
  },

  async beforeRouteLeave (to, from, next) {
    this.next = next

    if (this.numberOfChanges > 0) {
      this.confirmLeavePage = true
    } else {
      next()
    }
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
    v-model="confirmLeavePage"
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
    q-tab(:name="tabs.GENERAL" label="General" :ripple="false")
    q-tab(:name="tabs.VOTING" label="Voting" :ripple="false")
    q-tab(:name="tabs.COMMUNITY" label="Community" :ripple="false")
    q-tab(:name="tabs.COMMUNICATION" label="Communication" :ripple="false")
    q-tab(:name="tabs.DESIGN" label="Design" :ripple="false")
    q-tab(:name="tabs.PLAN" label="Plan Manager" :ripple="false" v-if="selectedDaoPlan.isActivated")

  settings-general(v-show="tab === tabs.GENERAL" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-voting(v-show="tab === tabs.VOTING" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-community(v-show="tab === tabs.COMMUNITY" v-bind="{ form, isAdmin, isHypha }" @change="onChange" @import="importElection").q-mt-xl
  settings-communication(v-show="tab === tabs.COMMUNICATION" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-design(v-show="tab === tabs.DESIGN" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-plan(v-show="tab === tabs.PLAN" :style="{marginTop: '70px'}")

  //- NAVIGATION SETTINGS
  nav.full-width.q-my-xl.row.justify-end(v-show="isAdmin && !hasActiveMultisig")
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
        @click="saveSettings"
        color="primary"
        label="Save changes"
        no-caps
        rounded
        unelevated
      )
      q-badge.notification-badge(:label="numberOfChanges" color="red" rounded size='10px' v-show="numberOfChanges > 0")

  //- NAVIGATION MULTISIG
  nav.full-width.q-my-xl.row.justify-end(v-show="isAdmin && hasActiveMultisig")
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
