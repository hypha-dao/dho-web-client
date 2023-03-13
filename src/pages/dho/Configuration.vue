<script>
import { mapActions, mapGetters } from 'vuex'
import { toHTML } from '~/utils/turndown'

const cloneDeep = value => JSON.parse(JSON.stringify(value))

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

export default {
  name: 'page-configuration',
  components: {
    ConfirmActionModal: () => import('~/components/common/confirm-action-modal.vue'),

    SettingsGeneral: () => import('~/components/dao/settings-general.vue'),
    SettingsVoting: () => import('~/components/dao/settings-voting.vue'),
    SettingsCommunity: () => import('~/components/dao/settings-community.vue'),
    SettingsCommunication: () => import('~/components/dao/settings-communication.vue'),
    SettingsDesign: () => import('~/components/dao/settings-design.vue'),
    SettingsPlan: () => import('~/components/dao/settings-plan.vue')

  },

  data () {
    return {
      confirmLeavePage: null,

      form: {},
      initialForm: {},

      tab: 'GENERAL',
      tabs: ['GENERAL', 'VOTING', 'COMMUNITY', 'COMMUNICATION', 'DESIGN', 'PLAN']
    }
  },

  methods: {
    ...mapActions('dao', ['importEdenElection', 'updateDAOSettings']),

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
        communityVotingQuorumPercent: this.daoSettings?.communityVotingQuorumPercent ? this.daoSettings?.communityVotingQuorumPercent : defaultSettings.communityotingQuorumPercent,

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

    async saveSettings () {
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

        await this.updateDAOSettings({
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
        })

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
    ...mapGetters('dao', ['daoAlerts', 'daoAnnouncements', 'daoSettings', 'isHypha', 'selectedDao', 'selectedDaoPlan']),

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
        if (tab && this.tabs.find(_ => _ === tab)) {
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
.page-configuration
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
    q-tab(name="GENERAL" label="General" :ripple="false")
    q-tab(name="VOTING" label="Voting" :ripple="false")
    q-tab(name="COMMUNITY" label="Community" :ripple="false")
    q-tab(name="COMMUNICATION" label="Communication" :ripple="false")
    q-tab(name="DESIGN" label="Design" :ripple="false")
    q-tab(name="PLAN" label="Plan Manager" :ripple="false" v-if="selectedDaoPlan.isActivated")

  settings-general(v-show="tab === 'GENERAL'" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-voting(v-show="tab === 'VOTING'" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-community(v-show="tab === 'COMMUNITY'" v-bind="{ form, isAdmin, isHypha }" @change="onChange" @import="importElection").q-mt-xl
  settings-communication(v-show="tab === 'COMMUNICATION'" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-design(v-show="tab === 'DESIGN'" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-plan(v-show="tab === 'PLAN'" :style="{marginTop: '70px'}")

  //- NAVIGATION
  nav.full-width.q-my-xl.row.justify-end(v-show="isAdmin")
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
</template>

<style lang="stylus" scoped>
</style>
