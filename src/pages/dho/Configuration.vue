<script>
import { mapActions, mapGetters } from 'vuex'
import { toHTML } from '~/utils/turndown'

const cloneDeep = value => JSON.parse(JSON.stringify(value))

const defaultSettings = {
  // GENERAL FORM
  socialChat: '',
  url: '',
  proposalsCreationEnabled: true,
  membersApplicationEnabled: true,
  removableBannersEnabled: true,

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
  organisationParagraph: ''

}

export default {
  name: 'page-configuration',
  components: {
    ConfirmActionModal: () => import('~/components/common/confirm-action-modal.vue'),

    SettingsGeneral: () => import('~/components/dao/settings-general.vue'),
    SettingsVoting: () => import('~/components/dao/settings-voting.vue'),
    SettingsCommunication: () => import('~/components/dao/settings-communication.vue'),
    SettingsDesign: () => import('~/components/dao/settings-design.vue')

  },

  data () {
    return {
      tab: 'GENERAL',

      form: {},
      initialForm: {},

      confirmLeavePage: null
    }
  },

  methods: {
    ...mapActions('dao', ['updateDAOSettings']),

    initForm () {
      this.initialForm = {
        socialChat: this.daoSettings?.socialChat ? this.daoSettings?.socialChat : defaultSettings.socialChat,
        url: this.daoSettings?.url ? this.daoSettings?.url : defaultSettings.url,
        proposalsCreationEnabled: this.daoSettings?.proposalsCreationEnabled !== null ? this.daoSettings?.proposalsCreationEnabled : defaultSettings.proposalsCreationEnabled,
        membersApplicationEnabled: this.daoSettings?.membersApplicationEnabled !== null ? this.daoSettings?.membersApplicationEnabled : defaultSettings.membersApplicationEnabled,
        removableBannersEnabled: this.daoSettings?.removableBannersEnabled !== null ? this.daoSettings?.removableBannersEnabled : defaultSettings.removableBannersEnabled,

        votingDurationSec: this.daoSettings?.votingDurationSec ? this.daoSettings?.votingDurationSec : defaultSettings.votingDurationSec,
        // periodDurationSec: this.daoSettings?.periodDurationSec ? this.daoSettings?.periodDurationSec : defaultSettings.periodDurationSec,
        votingAlignmentPercent: this.daoSettings?.votingAlignmentPercent ? this.daoSettings?.votingAlignmentPercent : defaultSettings.votingAlignmentPercent,
        votingQuorumPercent: this.daoSettings?.votingQuorumPercent ? this.daoSettings?.votingQuorumPercent : defaultSettings.votingQuorumPercent,

        // utilityTokenMultiplier: this.daoSettings?.utilityTokenMultiplier ? this.daoSettings?.utilityTokenMultiplier : defaultSettings.utilityTokenMultiplier,
        // voiceTokenMultiplier: this.daoSettings?.voiceTokenMultiplier ? this.daoSettings?.voiceTokenMultiplier : defaultSettings.voiceTokenMultiplier,
        // treasuryTokenMultiplier: this.daoSettings?.treasuryTokenMultiplier ? this.daoSettings?.treasuryTokenMultiplier : defaultSettings.treasuryTokenMultiplier,
        // voiceTokenDecayPeriod: this.daoSettings?.voiceTokenDecayPeriod ? this.daoSettings?.voiceTokenDecayPeriod : defaultSettings.voiceTokenDecayPeriod,

        // salaries: cloneDeep([...(this.daoSettings?.salaries ? this.daoSettings?.salaries : defaultSettings.salaries)]),

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
        organisationParagraph: this.daoSettings?.organisationParagraph ? this.daoSettings?.organisationParagraph : defaultSettings.organisationParagraph

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
        const { alerts, announcements, ...form } = this.form

        const alertsForCreate = alerts.filter((_) => !_?.id)
        const alertsForUpdate = alerts.filter(
          (_) => _?.id && this.initialForm.alerts.map(_ => _.id)?.includes(_?.id)
        )
        const alertsForDelete = this.initialForm.alerts.filter(
          (_) => _?.id && !alerts.map(_ => _.id)?.includes(_?.id)
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

        await this.updateDAOSettings({
          docId: this.selectedDao.docId,
          data: {
            ...form,
            proposalsCreationEnabled: form.proposalsCreationEnabled ? 1 : 0,
            membersApplicationEnabled: form.membersApplicationEnabled ? 1 : 0,
            removableBannersEnabled: form.removableBannersEnabled ? 1 : 0,

            votingAlignmentX100: form.votingAlignmentPercent,
            votingQuorumX100: form.votingQuorumPercent
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
    ...mapGetters('dao', ['daoAlerts', 'daoAnnouncements', 'daoSettings', 'isHypha', 'selectedDao']),

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

      console.log(JSON.stringify(changed))

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
    q-tab(name="COMMUNICATION" label="Communication" :ripple="false")
    q-tab(name="DESIGN" label="Design" :ripple="false")

  settings-general(v-show="tab === 'GENERAL'" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-voting(v-show="tab === 'VOTING'" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-communication(v-show="tab === 'COMMUNICATION'" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl
  settings-design(v-show="tab === 'DESIGN'" v-bind="{ form, isAdmin, isHypha }" @change="onChange").q-mt-xl

  //- NAVIGATION
  nav.full-width.q-my-xl.row.justify-end(v-show="isAdmin")
    q-btn.q-px-xl.rounded-border.text-bold.q-mr-xs(
      :disable="numberOfChanges === 0"
      @click="resetForm"
      color="white"
      label="Reset changes"
      no-caps
      rounded
      text-color="primary"
      unelevated
    )
    div.inline.relative-position
      q-btn.q-px-xl.rounded-border.text-bold.q-ml-xs(
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
