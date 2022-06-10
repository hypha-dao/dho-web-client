<script>
import { mapActions, mapGetters } from 'vuex'
import { hexToRGBA } from '~/utils/color'
import ipfsy from '~/utils/ipfsy'

const cloneDeep = value => JSON.parse(JSON.stringify(value))
// const logger = (...args) => console.log(JSON.parse(JSON.stringify(...args)))
const defaultSettings = {
  // GENERAL FORM
  documentationURL: '',
  discordURL: '',

  votingDurationSec: '',
  // periodDurationSec: '',
  votingAlignmentPercent: '',
  votingQuorumPercent: '',
  // voiceTokenDecayPeriod: '',

  // NOTIFICATIONS FORM
  notifications: [{ content: '', enabled: false, level: 'default' }],

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

// TODO: Refactor to mixin
const duration = {
  data () {
    return {
      durationOptions: [
        { label: '12h', value: 43200 },
        { label: '1d', value: 86400 },
        { label: '3d', value: 259200 },
        { label: '1w', value: 604800 },
        { label: '2w', value: 1209600 },
        { label: '1m', value: 2628000 } // TODO: This depeneds on month on selection
      ]
    }
  },

  methods: {
    isCustomDuration (duration) { return !this.durationOptions.map((_) => _.value).includes(duration) }
  },

  computed: {
    // isCustomPeriodDuration () { return this.isCustomDuration(this.form.periodDurationSec) },
    // isCustomVoiceTokenDecay () { return this.isCustomDuration(this.form.voiceTokenDecayPeriod) },
    isCustomVotingDuration () { return this.isCustomDuration(this.form.votingDurationSec) }
  }
}

export default {
  name: 'page-configuration',
  mixins: [duration],
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    ConfirmActionModal: () => import('~/components/common/confirm-action-modal.vue'),
    CustomPeriodInput: () => import('~/components/form/custom-period-input.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      tab: 'GENERAL',

      form: {},
      initialForm: {},

      logoBase64: null,
      extendedLogoBase64: null,
      splashBackgroundBase64: null,
      dashboardBackgroundBase64: null,
      proposalsBackgroundBase64: null,
      membersBackgroundBase64: null,
      organisationBackgroundBase64: null,

      confirmLeavePage: null,

      patterns: [
        { href: '/patterns/pattern-1.svg', cid: 'pattern-1' },
        { href: '/patterns/pattern-2.svg', cid: 'pattern-2' },
        { href: '/patterns/pattern-3.svg', cid: 'pattern-3' },
        { href: '/patterns/pattern-4.svg', cid: 'pattern-4' },
        { href: '/patterns/pattern-5.svg', cid: 'pattern-5' }
      ],

      banners: [
        {
          key: 'DASHBOARD',
          label: 'Dashboard',
          image: 'dashboardBackgroundImage',
          title: 'dashboardTitle',
          paragraph: 'dashboardParagraph',
          state: ''
        },
        {
          key: 'PROPOSALS',
          label: 'Proposals',
          image: 'proposalsBackgroundImage',
          title: 'proposalsTitle',
          paragraph: 'proposalsParagraph',
          state: ''
        },
        {
          key: 'MEMBERS',
          label: 'Members',
          image: 'membersBackgroundImage',
          title: 'membersTitle',
          paragraph: 'membersParagraph',
          state: ''
        },
        {
          key: 'ORGANISATION',
          label: 'Organisation',
          image: 'organisationBackgroundImage',
          title: 'organisationTitle',
          paragraph: 'organisationParagraph',
          state: ''
        }
      ]
    }
  },

  methods: {
    ...mapActions('dao', ['updateDAOSettings']),

    initForm () {
      this.initialForm = {
        documentationURL: this.daoSettings?.documentationURL ? this.daoSettings?.documentationURL : defaultSettings.documentationURL,
        discordURL: this.daoSettings?.discordURL ? this.daoSettings?.discordURL : defaultSettings.discordURL,

        votingDurationSec: this.daoSettings?.votingDurationSec ? this.daoSettings?.votingDurationSec : defaultSettings.votingDurationSec,
        // periodDurationSec: this.daoSettings?.periodDurationSec ? this.daoSettings?.periodDurationSec : defaultSettings.periodDurationSec,
        votingAlignmentPercent: this.daoSettings?.votingAlignmentPercent ? this.daoSettings?.votingAlignmentPercent : defaultSettings.votingAlignmentPercent,
        votingQuorumPercent: this.daoSettings?.votingQuorumPercent ? this.daoSettings?.votingQuorumPercent : defaultSettings.votingQuorumPercent,
        // voiceTokenDecayPeriod: this.daoSettings?.voiceTokenDecayPeriod ? this.daoSettings?.voiceTokenDecayPeriod : defaultSettings.voiceTokenDecayPeriod,

        notifications: cloneDeep([...(this.daoNotifications ? this.daoNotifications : defaultSettings.notifications)]),

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
        notifications: cloneDeep([...(this.daoNotifications ? this.daoNotifications : defaultSettings.notifications)])
      }
    },

    resetForm () {
      this.form = {
        ...this.initialForm,
        notifications: cloneDeep([...this.initialForm.notifications])
      }
    },

    async saveSettings () {
      try {
        const { notifications, ...form } = this.form
        const notificationsForCreate = notifications.filter((_) => !_?.id)
        const notificationsForUpdate = notifications.filter(
          (_) => _?.id && this.initialForm.notifications.map(_ => _.id)?.includes(_?.id)
        )
        const notificationsForDelete = this.initialForm.notifications.filter(
          (_) => _?.id && !notifications.map(_ => _.id)?.includes(_?.id)
        )

        await this.updateDAOSettings({
          docId: this.selectedDao.docId,
          data: {
            ...form,
            votingAlignmentX100: form.votingAlignmentPercent,
            votingQuorumX100: form.votingQuorumPercent
          },
          notifications: {
            created: notificationsForCreate,
            updated: notificationsForUpdate,
            deleted: notificationsForDelete
          }
        })

        this.initialForm = { ...this.form, notifications: cloneDeep([...this.form.notifications]) }
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    createBase64 (file, path) {
      const self = this
      const reader = new FileReader()
      reader.onload = function () { self[path] = reader.result }
      // reader.onerror = function (error) { console.log('Error: ', error) }
      reader.readAsDataURL(file)
    },

    ipfsy,

    toggleNotifications (activeIndex, value) {
      if (this.form.notifications.length > 1 && value) {
        this.form.notifications = this.form.notifications.map((_, index) => ({ ..._, enabled: index === activeIndex }))
      }
    },

    onLeavePageConfirmed (answer) {
      this.confirmLeavePage = false
      if (answer) {
        this.next()
      }
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isAdmin']),
    ...mapGetters('dao', ['selectedDao', 'daoNotifications', 'daoSettings']),

    hasChanged () { return Object.keys(this.form).some(field => this.form[field] !== this.initialForm[field]) },
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
    },

    previewGeneralmage () {
      const abr = this?.selectedDao ? this?.selectedDao?.name.toUpperCase().substring(0, 1) : ''
      const logo = this.logoBase64
      const pattern = this.form.patternBase64
      const { primaryColor, secondaryColor, textColor } = this.form

      const svg = `
<svg viewBox="0 0 888 462" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<path d="M868 0H20C8.9543 0 0 8.9543 0 20V442C0 453.046 8.9543 462 20 462H868C879.046 462 888 453.046 888 442V20C888 8.9543 879.046 0 868 0Z" fill="white"/>
<path d="M868 0.5H20C9.23045 0.5 0.5 9.23045 0.5 20V442C0.5 452.77 9.23045 461.5 20 461.5H868C878.77 461.5 887.5 452.77 887.5 442V20C887.5 9.23045 878.77 0.5 868 0.5Z" stroke="#CBCDD1"/>
<path d="M715 11H67C53.1929 11 42 22.1929 42 36V426C42 439.807 53.1929 451 67 451H715C728.807 451 740 439.807 740 426V36C740 22.1929 728.807 11 715 11Z" fill="#F1F1F3"/>
<path d="M653 47.2439H118C104.193 47.2439 93 58.4368 93 72.2439V159.999C93 173.806 104.193 184.999 118 184.999H653C666.807 184.999 678 173.806 678 159.999V72.2439C678 58.4368 666.807 47.2439 653 47.2439Z" fill="${primaryColor}"/>
<path d="M653 47.2439H118C104.193 47.2439 93 58.4368 93 72.2439V159.999C93 173.806 104.193 184.999 118 184.999H653C666.807 184.999 678 173.806 678 159.999V72.2439C678 58.4368 666.807 47.2439 653 47.2439Z" fill="url(#pattern0)" fill-opacity="1"/>
<path d="M169.84 143.26H119.915C114.991 143.26 111 147.251 111 152.175C111 157.099 114.991 161.09 119.915 161.09H169.84C174.764 161.09 178.755 157.099 178.755 152.175C178.755 147.251 174.764 143.26 169.84 143.26Z" fill="${primaryColor}"/>
<path d="M256.843 71.3982H119.915C114.991 71.3982 111 75.3896 111 80.3132C111 85.2368 114.991 89.2282 119.915 89.2282H256.843C261.767 89.2282 265.758 85.2368 265.758 80.3132C265.758 75.3896 261.767 71.3982 256.843 71.3982Z" fill="${textColor}"/>
<path d="M263.989 103.871H112.769C111.792 103.871 111 104.663 111 105.639C111 106.616 111.792 107.408 112.769 107.408H263.989C264.966 107.408 265.758 106.616 265.758 105.639C265.758 104.663 264.966 103.871 263.989 103.871Z" fill="#CBCDD1"/>
<path d="M226.708 116.465H112.769C111.792 116.465 111 117.257 111 118.233C111 119.21 111.792 120.002 112.769 120.002H226.708C227.685 120.002 228.477 119.21 228.477 118.233C228.477 117.257 227.685 116.465 226.708 116.465Z" fill="#CBCDD1"/>
<path d="M778 64C789.046 64 798 55.0457 798 44C798 32.9543 789.046 24 778 24C766.954 24 758 32.9543 758 44C758 55.0457 766.954 64 778 64Z" fill="${primaryColor}"/>
<path d="M775.773 37.4991V43.5111H782.841V45.4071H775.773V52.7991H773.445V35.6031H784.041V37.4991H775.773Z" fill="${primaryColor}"/>
<path d="M839.5 75.7339H763C760.239 75.7339 758 77.9725 758 80.7339C758 83.4953 760.239 85.7339 763 85.7339H839.5C842.261 85.7339 844.5 83.4953 844.5 80.7339C844.5 77.9725 842.261 75.7339 839.5 75.7339Z" fill="#3E3B46"/>
<path d="M803 390H768C762.477 390 758 394.477 758 400V435C758 440.523 762.477 445 768 445H803C808.523 445 813 440.523 813 435V400C813 394.477 808.523 390 803 390Z" fill="#F1F1F3"/>
<path d="M803 331H768C762.477 331 758 335.477 758 341V376C758 381.523 762.477 386 768 386H803C808.523 386 813 381.523 813 376V341C813 335.477 808.523 331 803 331Z" fill="#F1F1F3"/>
<path d="M24 186H19C16.2386 186 14 188.239 14 191V196C14 198.761 16.2386 201 19 201H24C26.7614 201 29 198.761 29 196V191C29 188.239 26.7614 186 24 186Z" fill="${primaryColor}"/>
<path d="M24 211H19C16.2386 211 14 213.239 14 216V221C14 223.761 16.2386 226 19 226H24C26.7614 226 29 223.761 29 221V216C29 213.239 26.7614 211 24 211Z" fill="#F1F1F3"/>
<path d="M24 236H19C16.2386 236 14 238.239 14 241V246C14 248.761 16.2386 251 19 251H24C26.7614 251 29 248.761 29 246V241C29 238.239 26.7614 236 24 236Z" fill="#F1F1F3"/>
<path d="M24 261H19C16.2386 261 14 263.239 14 266V271C14 273.761 16.2386 276 19 276H24C26.7614 276 29 273.761 29 271V266C29 263.239 26.7614 261 24 261Z" fill="#F1F1F3"/>
<path d="M862 390H827C821.477 390 817 394.477 817 400V435C817 440.523 821.477 445 827 445H862C867.523 445 872 440.523 872 435V400C872 394.477 867.523 390 862 390Z" fill="#F1F1F3"/>
<path d="M862 331H827C821.477 331 817 335.477 817 341V376C817 381.523 821.477 386 827 386H862C867.523 386 872 381.523 872 376V341C872 335.477 867.523 331 862 331Z" fill="#F1F1F3"/>
<path d="M653 195H560C546.193 195 535 206.193 535 220V389C535 402.807 546.193 414 560 414H653C666.807 414 678 402.807 678 389V220C678 206.193 666.807 195 653 195Z" fill="white"/>
<path d="M166 199.999H118C104.193 199.999 93 211.192 93 224.999V245.999C93 259.806 104.193 270.999 118 270.999H166C179.807 270.999 191 259.806 191 245.999V224.999C191 211.192 179.807 199.999 166 199.999Z" fill="white"/>
<path d="M137 218.47H115.469C112.708 218.47 110.469 220.709 110.469 223.47C110.469 226.231 112.708 228.47 115.469 228.47H137C139.761 228.47 142 226.231 142 223.47C142 220.709 139.761 218.47 137 218.47Z" fill="#3E3B46"/>
<path d="M124.466 239.951H112.238C111.261 239.951 110.469 240.743 110.469 241.72C110.469 242.696 111.261 243.488 112.238 243.488H124.466C125.443 243.488 126.235 242.696 126.235 241.72C126.235 240.743 125.443 239.951 124.466 239.951Z" fill="#CBCDD1"/>
<path d="M277 276H118C104.193 276 93 287.193 93 301V389C93 402.807 104.193 414 118 414H277C290.807 414 302 402.807 302 389V301C302 287.193 290.807 276 277 276Z" fill="white"/>
<path d="M498 276H339C325.193 276 314 287.193 314 301V389C314 402.807 325.193 414 339 414H498C511.807 414 523 402.807 523 389V301C523 287.193 511.807 276 498 276Z" fill="white"/>
<path d="M137 295.589H115.469C112.708 295.589 110.469 297.828 110.469 300.589C110.469 303.35 112.708 305.589 115.469 305.589H137C139.761 305.589 142 303.35 142 300.589C142 297.828 139.761 295.589 137 295.589Z" fill="#3E3B46"/>
<path d="M358 295.589H336.469C333.708 295.589 331.469 297.828 331.469 300.589C331.469 303.35 333.708 305.589 336.469 305.589H358C360.761 305.589 363 303.35 363 300.589C363 297.828 360.761 295.589 358 295.589Z" fill="#3E3B46"/>
<path d="M284.837 328.194H112.238C111.261 328.194 110.469 328.986 110.469 329.962C110.469 330.939 111.261 331.731 112.238 331.731H284.837C285.814 331.731 286.606 330.939 286.606 329.962C286.606 328.986 285.814 328.194 284.837 328.194Z" fill="#CBCDD1"/>
<path d="M505.837 328.194H333.238C332.261 328.194 331.469 328.986 331.469 329.962C331.469 330.939 332.261 331.731 333.238 331.731H505.837C506.814 331.731 507.606 330.939 507.606 329.962C507.606 328.986 506.814 328.194 505.837 328.194Z" fill="#CBCDD1"/>
<path d="M284.837 341.791H112.238C111.261 341.791 110.469 342.583 110.469 343.56C110.469 344.536 111.261 345.328 112.238 345.328H284.837C285.814 345.328 286.606 344.536 286.606 343.56C286.606 342.583 285.814 341.791 284.837 341.791Z" fill="#CBCDD1"/>
<path d="M505.837 341.791H333.238C332.261 341.791 331.469 342.583 331.469 343.56C331.469 344.536 332.261 345.328 333.238 345.328H505.837C506.814 345.328 507.606 344.536 507.606 343.56C507.606 342.583 506.814 341.791 505.837 341.791Z" fill="#CBCDD1"/>
<path d="M202.231 355.387H112.238C111.261 355.387 110.469 356.179 110.469 357.155C110.469 358.132 111.261 358.924 112.238 358.924H202.231C203.208 358.924 204 358.132 204 357.155C204 356.179 203.208 355.387 202.231 355.387Z" fill="#CBCDD1"/>
<path d="M423.231 355.387H333.238C332.261 355.387 331.469 356.179 331.469 357.155C331.469 358.132 332.261 358.924 333.238 358.924H423.231C424.208 358.924 425 358.132 425 357.155C425 356.179 424.208 355.387 423.231 355.387Z" fill="#CBCDD1"/>
<path d="M277 199.999H229C215.193 199.999 204 211.192 204 224.999V245.999C204 259.806 215.193 270.999 229 270.999H277C290.807 270.999 302 259.806 302 245.999V224.999C302 211.192 290.807 199.999 277 199.999Z" fill="white"/>
<path d="M247.817 218.47H226.286C223.525 218.47 221.286 220.709 221.286 223.47C221.286 226.231 223.525 228.47 226.286 228.47H247.817C250.578 228.47 252.817 226.231 252.817 223.47C252.817 220.709 250.578 218.47 247.817 218.47Z" fill="#3E3B46"/>
<path d="M235.283 239.951H223.055C222.078 239.951 221.286 240.743 221.286 241.72C221.286 242.696 222.078 243.488 223.055 243.488H235.283C236.26 243.488 237.052 242.696 237.052 241.72C237.052 240.743 236.26 239.951 235.283 239.951Z" fill="#CBCDD1"/>
<path d="M388 199.999H340C326.193 199.999 315 211.192 315 224.999V245.999C315 259.806 326.193 270.999 340 270.999H388C401.807 270.999 413 259.806 413 245.999V224.999C413 211.192 401.807 199.999 388 199.999Z" fill="white"/>
<path d="M358.635 218.47H337.104C334.343 218.47 332.104 220.709 332.104 223.47C332.104 226.231 334.343 228.47 337.104 228.47H358.635C361.396 228.47 363.635 226.231 363.635 223.47C363.635 220.709 361.396 218.47 358.635 218.47Z" fill="#3E3B46"/>
<path d="M346.101 239.951H333.873C332.896 239.951 332.104 240.743 332.104 241.72C332.104 242.696 332.896 243.488 333.873 243.488H346.101C347.078 243.488 347.87 242.696 347.87 241.72C347.87 240.743 347.078 239.951 346.101 239.951Z" fill="#CBCDD1"/>
<path d="M498 199.999H450C436.193 199.999 425 211.192 425 224.999V245.999C425 259.806 436.193 270.999 450 270.999H498C511.807 270.999 523 259.806 523 245.999V224.999C523 211.192 511.807 199.999 498 199.999Z" fill="white"/>
<path d="M469.453 218.47H447.922C445.161 218.47 442.922 220.709 442.922 223.47C442.922 226.231 445.161 228.47 447.922 228.47H469.453C472.214 228.47 474.453 226.231 474.453 223.47C474.453 220.709 472.214 218.47 469.453 218.47Z" fill="#3E3B46"/>
<path d="M456.919 239.951H444.691C443.714 239.951 442.922 240.743 442.922 241.72C442.922 242.696 443.714 243.488 444.691 243.488H456.919C457.896 243.488 458.688 242.696 458.688 241.72C458.688 240.743 457.896 239.951 456.919 239.951Z" fill="#CBCDD1"/>
<path d="M581.453 218.229H559.922C557.16 218.229 554.922 220.468 554.922 223.229C554.922 225.99 557.16 228.229 559.922 228.229H581.453C584.214 228.229 586.453 225.99 586.453 223.229C586.453 220.468 584.214 218.229 581.453 218.229Z" fill="#3E3B46"/>
<path d="M622.231 268.625H585.769C584.792 268.625 584 269.417 584 270.393C584 271.37 584.792 272.162 585.769 272.162H622.231C623.208 272.162 624 271.37 624 270.393C624 269.417 623.208 268.625 622.231 268.625Z" fill="#CBCDD1"/>
<path d="M640.496 253.162H588.079C585.783 253.162 583.922 255.023 583.922 257.318C583.922 259.614 585.783 261.475 588.079 261.475H640.496C642.792 261.475 644.653 259.614 644.653 257.318C644.653 255.023 642.792 253.162 640.496 253.162Z" fill="#3E3B46"/>
<path d="M564.5 272C569.747 272 574 267.747 574 262.5C574 257.253 569.747 253 564.5 253C559.253 253 555 257.253 555 262.5C555 267.747 559.253 272 564.5 272Z" fill="${secondaryColor}"/>
<path d="M622.231 308.065H585.769C584.792 308.065 584 308.857 584 309.834C584 310.81 584.792 311.602 585.769 311.602H622.231C623.208 311.602 624 310.81 624 309.834C624 308.857 623.208 308.065 622.231 308.065Z" fill="#CBCDD1"/>
<path d="M640.496 292.602H588.079C585.783 292.602 583.922 294.463 583.922 296.759C583.922 299.054 585.783 300.915 588.079 300.915H640.496C642.792 300.915 644.653 299.054 644.653 296.759C644.653 294.463 642.792 292.602 640.496 292.602Z" fill="#3E3B46"/>
<path d="M564.5 311.602C569.747 311.602 574 307.349 574 302.102C574 296.855 569.747 292.602 564.5 292.602C559.253 292.602 555 296.855 555 302.102C555 307.349 559.253 311.602 564.5 311.602Z" fill="${secondaryColor}"/>
<path d="M622.231 347.505H585.769C584.792 347.505 584 348.297 584 349.274C584 350.25 584.792 351.042 585.769 351.042H622.231C623.208 351.042 624 350.25 624 349.274C624 348.297 623.208 347.505 622.231 347.505Z" fill="#CBCDD1"/>
<path d="M640.496 332.042H588.079C585.783 332.042 583.922 333.903 583.922 336.198C583.922 338.494 585.783 340.355 588.079 340.355H640.496C642.792 340.355 644.653 338.494 644.653 336.198C644.653 333.903 642.792 332.042 640.496 332.042Z" fill="#3E3B46"/>
<path d="M564.5 351.042C569.747 351.042 574 346.789 574 341.542C574 336.295 569.747 332.042 564.5 332.042C559.253 332.042 555 336.295 555 341.542C555 346.789 559.253 351.042 564.5 351.042Z" fill="${secondaryColor}"/>
<path d="M622.231 387.251H585.769C584.792 387.251 584 388.043 584 389.019C584 389.996 584.792 390.788 585.769 390.788H622.231C623.208 390.788 624 389.996 624 389.019C624 388.043 623.208 387.251 622.231 387.251Z" fill="#CBCDD1"/>
<path d="M640.496 371.788H588.079C585.783 371.788 583.922 373.649 583.922 375.944C583.922 378.24 585.783 380.101 588.079 380.101H640.496C642.792 380.101 644.653 378.24 644.653 375.944C644.653 373.649 642.792 371.788 640.496 371.788Z" fill="#3E3B46"/>
<path d="M564.5 390.788C569.747 390.788 574 386.535 574 381.288C574 376.041 569.747 371.788 564.5 371.788C559.253 371.788 555 376.041 555 381.288C555 386.535 559.253 390.788 564.5 390.788Z" fill="${secondaryColor}"/>
<path d="M169.309 377.98H119.384C114.46 377.98 110.469 381.971 110.469 386.895C110.469 391.819 114.46 395.81 119.384 395.81H169.309C174.233 395.81 178.224 391.819 178.224 386.895C178.224 381.971 174.233 377.98 169.309 377.98Z" fill="${secondaryColor}"/>
<path d="M772 165.758H763C760.239 165.758 758 167.997 758 170.758V179.758C758 182.519 760.239 184.758 763 184.758H772C774.761 184.758 777 182.519 777 179.758V170.758C777 167.997 774.761 165.758 772 165.758Z" fill="${primaryColor}"/>
<path d="M772 200.156H763C760.239 200.156 758 202.395 758 205.156V214.156C758 216.917 760.239 219.156 763 219.156H772C774.761 219.156 777 216.917 777 214.156V205.156C777 202.395 774.761 200.156 772 200.156Z" fill="${primaryColor}"/>
<path d="M772 234.555H763C760.239 234.555 758 236.794 758 239.555V248.555C758 251.316 760.239 253.555 763 253.555H772C774.761 253.555 777 251.316 777 248.555V239.555C777 236.794 774.761 234.555 772 234.555Z" fill="${primaryColor}"/>
<path d="M823.309 181.221H786.847C785.87 181.221 785.078 182.013 785.078 182.989C785.078 183.966 785.87 184.758 786.847 184.758H823.309C824.286 184.758 825.078 183.966 825.078 182.989C825.078 182.013 824.286 181.221 823.309 181.221Z" fill="#CBCDD1"/>
<path d="M823.309 215.619H786.847C785.87 215.619 785.078 216.411 785.078 217.388C785.078 218.364 785.87 219.156 786.847 219.156H823.309C824.286 219.156 825.078 218.364 825.078 217.388C825.078 216.411 824.286 215.619 823.309 215.619Z" fill="#CBCDD1"/>
<path d="M823.309 250.018H786.847C785.87 250.018 785.078 250.81 785.078 251.787C785.078 252.763 785.87 253.555 786.847 253.555H823.309C824.286 253.555 825.078 252.763 825.078 251.787C825.078 250.81 824.286 250.018 823.309 250.018Z" fill="#CBCDD1"/>
<path d="M841.574 165.758H789.157C786.861 165.758 785 167.619 785 169.915C785 172.21 786.861 174.071 789.157 174.071H841.574C843.87 174.071 845.731 172.21 845.731 169.915C845.731 167.619 843.87 165.758 841.574 165.758Z" fill="#3E3B46"/>
<path d="M841.574 200.156H789.157C786.861 200.156 785 202.017 785 204.313C785 206.608 786.861 208.469 789.157 208.469H841.574C843.87 208.469 845.731 206.608 845.731 204.313C845.731 202.017 843.87 200.156 841.574 200.156Z" fill="#3E3B46"/>
<path d="M841.574 234.555H789.157C786.861 234.555 785 236.416 785 238.711C785 241.007 786.861 242.868 789.157 242.868H841.574C843.87 242.868 845.731 241.007 845.731 238.711C845.731 236.416 843.87 234.555 841.574 234.555Z" fill="#3E3B46"/>
<path d="M775 172C777.209 172 779 170.209 779 168C779 165.791 777.209 164 775 164C772.791 164 771 165.791 771 168C771 170.209 772.791 172 775 172Z" fill="#EF3F69"/>
<path d="M793.978 90.7051H762.022C759.801 90.7051 758 92.5058 758 94.7271C758 96.9484 759.801 98.7491 762.022 98.7491H793.978C796.199 98.7491 798 96.9484 798 94.7271C798 92.5058 796.199 90.7051 793.978 90.7051Z" fill="${primaryColor}"/>


        ${logo
        ? ''
        : `
        <path d="M21.5 50C28.9558 50 35 43.9558 35 36.5C35 29.0442 28.9558 23 21.5 23C14.0442 23 8 29.0442 8 36.5C8 43.9558 14.0442 50 21.5 50Z" fill="${primaryColor}"/>
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="Lato" font-size="14" font-weight="800" letter-spacing="0em"><tspan x="18" y="41.918">${abr}</tspan></text>
        `}
        
     


<mask id="mask0_29_129" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="8" y="23" width="27" height="27">
<path d="M21.5 50C28.9558 50 35 43.9558 35 36.5C35 29.0442 28.9558 23 21.5 23C14.0442 23 8 29.0442 8 36.5C8 43.9558 14.0442 50 21.5 50Z" fill="red" />
</mask>

<g mask="url(#mask0_29_129)">
<path d="M42 21H2V52.6667H42V21Z" fill="url(#pattern1)"/>
</g>

<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="0.248769" height="0.989365">
<use xlink:href="#image0_29_129" transform="scale(0.000564103 0.00239556)"/>
</pattern>

<pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image1_29_129" transform="scale(0.0142858 0.0151515)"/>
</pattern>

<image id="image0_29_129" width="441" height="413" xlink:href="${pattern}"/>
<image id="image1_29_129" width="70" height="66" xlink:href="${logo}"/>
</defs>
</svg>

`
      return 'data:image/svg+xml;base64,' + btoa(svg)
    },

    previewSplashImage () {
      const { primaryColor, secondaryColor } = this.form
      const logo = this.logoBase64
      // const extendedLogo = this.extendedLogoBase64
      const pattern = this.patternBase64
      const backgroundImage = this.splashBackgroundBase64

      console.log('backgroundImage', pattern, backgroundImage, primaryColor)

      const svg = `
        <svg viewBox="0 0 888 462" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <rect width="888" height="462" fill="#E5E5E5"/>
          <path d="M868 0H20C8.9543 0 0 8.9543 0 20V442C0 453.046 8.9543 462 20 462H868C879.046 462 888 453.046 888 442V20C888 8.9543 879.046 0 868 0Z" fill="white"/>
          <path d="M868 0.5H20C9.23045 0.5 0.5 9.23045 0.5 20V442C0.5 452.77 9.23045 461.5 20 461.5H868C878.77 461.5 887.5 452.77 887.5 442V20C887.5 9.23045 878.77 0.5 868 0.5Z" stroke="#CBCDD1"/>
          <path d="M198 0H868C873.304 0 878.391 2.10714 882.142 5.85786C885.893 9.60859 888 14.6957 888 20V442C888 447.304 885.893 452.391 882.142 456.142C878.391 459.893 873.304 462 868 462H198V0Z" fill="${primaryColor}"/>
          <path d="M198 0H868C873.304 0 878.391 2.10714 882.142 5.85786C885.893 9.60859 888 14.6957 888 20V442C888 447.304 885.893 452.391 882.142 456.142C878.391 459.893 873.304 462 868 462H198V0Z" fill="url(#pattern0)"/>
          <rect x="198" width="690" height="462" fill="url(#pattern1)"/>
          <path d="M161.177 322.17H35.915C30.9914 322.17 27 326.161 27 331.085C27 336.009 30.9914 340 35.915 340H161.177C166.101 340 170.092 336.009 170.092 331.085C170.092 326.161 166.101 322.17 161.177 322.17Z" fill="${primaryColor}"/>
          <path d="M144.06 123.514H35.915C30.9914 123.514 27 127.505 27 132.429C27 137.353 30.9914 141.344 35.915 141.344H144.06C148.984 141.344 152.975 137.353 152.975 132.429C152.975 127.505 148.984 123.514 144.06 123.514Z" fill="#3E3B46"/>
          <path d="M161.177 349.057H35.915C30.9914 349.057 27 353.049 27 357.972C27 362.896 30.9914 366.887 35.915 366.887H161.177C166.101 366.887 170.092 362.896 170.092 357.972C170.092 353.049 166.101 349.057 161.177 349.057Z" fill="${secondaryColor}"/>
          <path d="M161.177 376.443H35.915C31.2675 376.443 27.5 380.21 27.5 384.858C27.5 389.505 31.2675 393.273 35.915 393.273H161.177C165.824 393.273 169.592 389.505 169.592 384.858C169.592 380.21 165.824 376.443 161.177 376.443Z" stroke="#3E3B46"/>
          <path d="M168.323 159.473H28.769C27.792 159.473 27 160.265 27 161.241C27 162.218 27.792 163.01 28.769 163.01H168.323C169.3 163.01 170.092 162.218 170.092 161.241C170.092 160.265 169.3 159.473 168.323 159.473Z" fill="#CBCDD1"/>
          <path d="M142.708 172.066H28.769C27.792 172.066 27 172.858 27 173.834C27 174.811 27.792 175.603 28.769 175.603H142.708C143.685 175.603 144.477 174.811 144.477 173.834C144.477 172.858 143.685 172.066 142.708 172.066Z" fill="#CBCDD1"/>
          <path d="M35.5 48C42.9558 48 49 41.9558 49 34.5C49 27.0442 42.9558 21 35.5 21C28.0442 21 22 27.0442 22 34.5C22 41.9558 28.0442 48 35.5 48Z" fill="${primaryColor}"/>
          <text fill="white" xml:space="preserve" style="white-space: pre" font-family="Lato" font-size="14" font-weight="800" letter-spacing="0em"><tspan x="32" y="39.918">L</tspan></text>
          <rect x="22" y="21" width="27" height="27" fill="url(#pattern2)"/>
          <path d="M543.5 285C573.047 285 597 261.047 597 231.5C597 201.953 573.047 178 543.5 178C513.953 178 490 201.953 490 231.5C490 261.047 513.953 285 543.5 285Z" fill="${primaryColor}"/>
          <path d="M557.465 246.996V253.096H534.182V213.35H541.576V246.996H557.465Z" fill="white"/>
          <rect x="490" y="178" width="107" height="107" fill="url(#pattern3)"/>
          <defs>
     
          <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlink:href="#image0_0_1" transform="scale(0.00144928 0.0021645)"/>
          </pattern>
          <pattern id="pattern2" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlink:href="#image1_0_1" transform="scale(0.0185185)"/>
          </pattern>
          <pattern id="pattern3" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlink:href="#image2_0_1" transform="scale(0.00934579)"/>
          </pattern>
          <image id="image0_0_1" width="690" height="462" xlink:href="${backgroundImage}"/>
          <image id="image1_0_1" width="54" height="54" xlink:href="${logo}"/>
          <image id="image2_0_1" width="107" height="107" xlink:href="${logo}"/>
          </defs>
        </svg>
      `
      return 'data:image/svg+xml;base64,' + btoa(svg)
    }
  },

  async mounted () {
    this.initForm()

    this.$watch(() => [this.form.pattern, this.form.patternColor, this.form.patternOpacity],
      async ([pattern, patternColor, patternOpacity]) => {
        const svg = await fetch(`/patterns/${pattern}.svg`).then(_ => _.text())
        this.form.patternBase64 = 'data:image/svg+xml;base64,' + btoa(svg.replace(/black/g, hexToRGBA(patternColor, patternOpacity)))
      })
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
    daoSettings: {
      handler: function () {
        this.initForm()
      }
    },

    'form.splashBackgroundImage': {
      handler: async function (value) {
        const blob = await fetch(this.ipfsy(value)).then(_ => _.blob())
        this.createBase64(blob, 'splashBackgroundBase64')
      }
    }
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
  //- General
  widget(title='General Settings' titleImage='/icons/settings-general-icon.svg' :bar='true').q-pa-none.full-width
    p.q-mt-md.subtitle Any configuration changes are effective immediately, even if a vote is still in progress.  For this reason, change settings only if there are few to none open proposals.

    .row
      .col-6.q-pr-sm
        .row.items-center.q-col-gutter-xs
          label.h-label Documentation Link
          q-icon(name="fas fa-info-circle" size="16px" color="body")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Add a link to your DAO documentation here. Could be your website or a wiki where users can learn more about your DAO. The link will be added to the Banner on the Organization Page.
        q-input.q-my-sm.rounded-border(
          :debounce="200"
          :disable="!isAdmin"
          bg-color="white"
          color="accent"
          dense
          lazy-rules
          outlined
          placeholder="Paste the URL address here"
          ref="name"
          rounded
          v-model='form.documentationURL'
        )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings
      .col-6.q-pl-sm
        .row.items-center.q-col-gutter-xs
          label.h-label Discord Link
          q-icon(name="fas fa-info-circle" size="16px" color="body")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Add a link to your Discord Server here. The link will be added on the Dashboard in the "Need Support?" Widget as well as the Help Page.
        q-input.q-my-sm.rounded-border(
          :debounce="200"
          :disable="!isAdmin"
          bg-color="white"
          color="accent"
          dense
          lazy-rules
          outlined
          placeholder="Paste the URL address here"
          ref="name"
          rounded
          v-model='form.discordURL'
        )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

    .row.q-mt-xl
      .col-6.q-pr-sm
        .row.items-center.q-col-gutter-xs
          label.h-label Vote alignment (Unity)
          q-icon(name="fas fa-info-circle" size="16px" color="body")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Unity is the minimum required percentage of members supporting (voting for, vs voting against) a proposal for it to pass. Make this 100% if you wish to have consensus, or 50% for classical majority-rule democracy, etc
        .row.full-width.items-center
          .col-7.row.q-mr-sm
            q-slider(
              :disable="!isAdmin"
              :max="100"
              :min="0"
              :step="1"
              color="primary"
              v-model="form.votingAlignmentPercent"
            )
          .col-grow
            q-input.rounded-border.q-py-sm(
              :disable="!isAdmin"
              :rules="[val => val >= 0 && val <= 100]"
              dense
              outlined
              rounded
              suffix="%"
              v-model.number="form.votingAlignmentPercent"
            )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings
      .col-6.q-pl-sm
        .row.items-center.q-col-gutter-xs
          label.h-label Vote quorum
          q-icon(name="fas fa-info-circle" size="16px" color="body")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Quorum is the minimum required percentage of total members participating in the vote for it to pass.
        .row.full-width.items-center
          .col-7.row.q-mr-sm
            q-slider(
              :disable="!isAdmin"
              :max="100"
              :min="0"
              :step="1"
              color="primary"
              v-model="form.votingQuorumPercent"
            )
          .col-grow
            q-input.rounded-border.q-py-sm(
              :disable="!isAdmin"
              :rules="[val => val >= 0 && val <= 100]"
              dense
              outlined
              rounded
              suffix="%"
              v-model.number="form.votingQuorumPercent"
            )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

    .row.q-mt-xl
      .col-6.row.q-pr-sm
        .row.items-end.full-width
          .row.items-center.q-col-gutter-xs
            label.h-label Vote duration
            q-icon(name="fas fa-info-circle" size="16px" color="body")
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Is the duration period the vote is active and member can cast one or more votes.
          .q-mt-xs.row.full-width
            .col-7.row.justify-between.q-mr-sm
              q-btn.button.text-bold.text-lowercase(
                :color="form.votingDurationSec === option.value ? 'primary' : 'internal-bg'"
                :disable="!isAdmin"
                :key='index'
                :text-color="form.votingDurationSec === option.value ? 'white' : 'primary'"
                @click="form.votingDurationSec = option.value"
                padding="none"
                rounded
                unelevated
                v-for='(option, index) in durationOptions'
              ) {{ option.label }}
            .col-grow
              custom-period-input(:disable="!isAdmin" :isActive="isCustomVotingDuration" @selected="form.votingDurationSec = 0" v-model='form.votingDurationSec')
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      //- .col-6.row.q-pl-sm
      //-   .row.items-end.full-width
      //-     label.h-label Period duration
      //-     .q-mt-xs.row.full-width
      //-       .col-7.row.justify-between.q-mr-sm
      //-         q-btn.button.text-bold.text-lowercase(
      //-           :color="form.periodDurationSec === option.value ? 'primary' : 'internal-bg'"
      //-           :disable="!isAdmin"
      //-           :key='index'
      //-           :text-color="form.periodDurationSec === option.value ? 'white' : 'primary'"
      //-           @click="form.periodDurationSec = option.value"
      //-           padding="none"
      //-           rounded
      //-           unelevated
      //-           v-for='(option, index) in durationOptions'
      //-         ) {{ option.label }}
      //-       .col-grow
      //-         custom-period-input(:disable="!isAdmin" :isActive="isCustomPeriodDuration" @selected="form.periodDurationSec = 0" v-model='form.periodDurationSec')
      //-     q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

    //- .row.q-mt-xl
    //-   .col-6.row.q-pr-sm
    //-     .row.items-end.full-width
    //-       label.h-label Decay Period for Voting
    //-       .q-mt-xs.row.full-width
    //-         .col-7.row.justify-between.q-mr-sm
    //-           q-btn.button.text-bold.text-lowercase(
    //-             :color="form.voiceTokenDecayPeriod === option.value ? 'primary' : 'internal-bg'"
    //-             :disable="!isAdmin"
    //-             :key='index'
    //-             :text-color="form.voiceTokenDecayPeriod === option.value ? 'white' : 'primary'"
    //-             @click="form.voiceTokenDecayPeriod = option.value"
    //-             padding="none"
    //-             rounded
    //-             unelevated
    //-             v-for='(option, index) in durationOptions'
    //-           ) {{ option.label }}
    //-         .col-grow
    //-           custom-period-input(:disable="!isAdmin" :isActive="isCustomVoiceTokenDecay" @selected="form.voiceTokenDecayPeriod = 0" v-model='form.voiceTokenDecayPeriod')
    //-       q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

  //- Notifications
  widget(title='Notifications' titleImage='/icons/settings-notification-icon.svg' :bar='true').q-pa-none.full-width.q-mt-md
    p.q-mt-md.subtitle Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    template(v-for="(notification, index) in form.notifications")
      .row.q-mt-sm
        .col
          label.h-label Notification {{ index + 1 }}
          q-input.q-my-sm.rounded-border(
            :debounce="200"
            :disable="!isAdmin"
            :ref="'notification.' + index + '.content'"
            bg-color="white"
            color="accent"
            dense
            lazy-rules
            maxlength="200"
            outlined
            placeholder="Enter your message here"
            rounded
            v-model="notification.content"
          )
        .col-auto.q-pt-xxl
          q-toggle(v-model="notification.enabled" color="secondary" :disable="!isAdmin" @input="(value) => toggleNotifications(index,value )")

      nav.row.full-width.justify-end
        q-btn(:disable="form.notifications.length === 1 || !isAdmin" flat color="primary" no-caps padding="none" @click="form.notifications.splice(index, 1)").text-bold.q-pa-none.q-mr-xs Remove notification -
        q-btn(:disable="form.notifications.length === 10 || !isAdmin" v-show="index === form.notifications.length - 1" flat color="primary" no-caps padding="none" @click="form.notifications.push({content:'', enabled:false, level:'default' })").text-bold.q-pa-none.q-ml-lg.q-mr-xs Add more +

  //- Design
  widget(title='Design' titleImage='/icons/settings-design-icon.svg' :bar='true').q-pa-none.full-width.q-mt-md
    p.q-mt-md.subtitle You can style your DAO here - changes can take a couple of minutes until they are live and you might have to empty your cache in order to see them displayed correctly.

    q-tabs.col-3.border-b.text-grey(
      active-color="primary"
      align="start"
      indicator-color="primary"
      no-caps
      v-model="tab"
    )
      q-tab(name="GENERAL" label="General")
      q-tab(name="SPLASHPAGE" label="Splashpage")
      q-tab(name="BANNERS" label="Banners")

    div(v-if="tab==='GENERAL'").row.justify-between.full-width.q-mt-xl
      .row.justify-center.items-center.full-width.q-my-xl
        .col-8
          img(:src='previewGeneralmage')

      .col-3
        .full-width.h-asset.items-start.q-mt-xl.text-center
          .row.full-width.rounded-border.overflow-hidden(:style="{'height':'110px'}")
            .col-6.row.justify-center.items-center(:style="{'background-color': form.primaryColor}")
              p.q-pa-none.q-ma-none.font-lato.leading-none(:style="{'color': form.textColor, 'font-size': '50px'}") a
            .col-6.row.justify-center.items-center(:style="{'background-color': form.secondaryColor}")
              p.q-pa-none.q-ma-none.font-lato.leading-none(:style="{'color': form.textColor, 'font-size': '50px'}") a

        .full-width.items-start.q-mt-xl
          label.h-label Primary color
          .row.full-width.items-center.q-mt-sm
            .col-auto.q-mr-sm
              q-avatar(size="40px" :style="{'background': form.primaryColor, 'cursor': 'context-menu'}")
                q-popup-proxy(v-show="isAdmin" cover transition-show="scale" transition-hide="scale")
                  q-color(:disable="!isAdmin" v-model="form.primaryColor")
            .col
              q-input.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="50"
                outlined
                placeholder="#9376GJ9"
                ref="name"
                rounded
                v-model="form.primaryColor"
              )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .full-width.items-start.q-mt-xl
          label.h-label Secondary color
          .row.full-width.items-center.q-mt-sm
            .col-auto.q-mr-sm
              q-avatar(size="40px" :style="{'background': form.secondaryColor, 'cursor': 'context-menu'}")
                q-popup-proxy(v-show="isAdmin" cover transition-show="scale" transition-hide="scale")
                  q-color(:disable="!isAdmin" v-model="form.secondaryColor")
            .col
              q-input.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="50"
                outlined
                placeholder="#9376GJ9"
                ref="name"
                rounded
                v-model="form.secondaryColor"
              )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .full-width.items-start.q-mt-xl
          label.h-label Text on color
          .row.full-width.items-center.q-mt-sm
            .col-auto.q-mr-sm
              q-avatar(size="40px" :style="{'background': form.textColor, 'border': form.textColor !== '#ffffff' ? '' : '1px solid #A3A5AA', 'cursor': 'context-menu'}")
                q-popup-proxy(v-show="isAdmin" cover transition-show="scale" transition-hide="scale")
                  q-color(:disable="!isAdmin" v-model="form.textColor")
            .col
              q-input.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="50"
                outlined
                placeholder="#9376GJ9"
                ref="name"
                rounded
                v-model="form.textColor"
              )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      .col-3
        .full-width.h-asset.items-start.q-mt-xl.text-center

        .full-width.items-start.q-mt-xl
          label.h-label Logo
          .row.full-width.items-center.q-mt-sm
            .col-auto.q-mr-sm.text-uppercase
              q-avatar(size="40px" font-size="24px" color="primary" text-color="white")
                span(v-show="!form.logo") {{ this.selectedDao.name.slice(0,1) }}
                img(v-show="form.logo" :src="ipfsy(form.logo)")

            .col
              ipfs-image-viewer(:ipfsCid="form.logo" @loaded="createBase64(arguments[0], 'logoBase64')").hidden
              q-btn.full-width.q-px-xl.rounded-border.text-bold(
                :disable="!isAdmin"
                @click="$refs.ipfsInput.chooseFile()"
                color="primary"
                label="Upload an image"
                no-caps
                outline
                rounded
                unelevated
              )
              input-file-ipfs(
                @uploadedFile="form.logo = arguments[0]"
                image
                ref="ipfsInput"
                v-show="false"
              )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .full-width.items-start.q-mt-xl
          label.h-label Extended Logo
          .row.full-width.items-center.q-mt-sm
            .col-auto.q-mr-sm.text-uppercase
              q-avatar(size="40px" font-size="24px" color="primary" text-color="white")
                span(v-show="!form.extendedLogo") {{ this.selectedDao.name.slice(0,1) }}
                img(v-show="form.extendedLogo" :src="ipfsy(form.extendedLogo)")

            .col
              ipfs-image-viewer(:ipfsCid="form.extendedLogo" @loaded="createBase64(arguments[0], 'extendedLogoBase64')").hidden
              q-btn.full-width.q-px-xl.rounded-border.text-bold(
                :disable="!isAdmin"
                @click="$refs.extendedLogoInput.chooseFile()"
                color="primary"
                label="Upload an image"
                no-caps
                outline
                rounded
                unelevated
              )
              input-file-ipfs(
                @uploadedFile="form.extendedLogo = arguments[0]"
                image
                ref="extendedLogoInput"
                v-show="false"
              )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      .col-3
        .full-width.h-asset.items-start.q-mt-xl.text-center
          div.full-width.full-height.rounded-border(:style="{'background': `${form.primaryColor} url('${form.patternBase64}')`, 'background-size': '200px' }")

        .full-width.items-start.q-mt-xl
          label.h-label Pattern
          .row.full-width.justify-between.items-center.q-mt-sm
            template(v-for='(pattern, index) in patterns')
              q-btn(
                :disable="!isAdmin"
                :style="{'background': pattern.color, 'border': form.pattern === pattern.cid ? '1px solid #242F5D' : '1px solid transparent', 'padding': '1px'}"
                @click="form.pattern = pattern.cid"
                flat
                padding="1px"
                round
              )
                q-avatar(size="40px")
                  img(:src="pattern.href" :style="{'transform': 'scale(2)'}")

            q-btn(
              :style="{'border': form.pattern === '' ? '1px solid #242F5D' : '1px solid #84878E'}"
              @click="form.pattern = ''"
              flat
              round
              color='primary'
              text-color="black"
            )
              q-icon.q-pa-xs(size="xs" name="fas fa-ban").text-h-gray
              //- q-icon(left size="3em" name="fas fa-ban")

        .full-width.items-start.q-mt-xl
          label.h-label Color
          .row.full-width.items-center.q-mt-sm
            .col-auto.q-mr-xs
              q-avatar(size="40px" :style="{'background': form.patternColor, 'cursor': 'context-menu'}")
                q-popup-proxy(v-show="isAdmin" cover transition-show="scale" transition-hide="scale")
                  q-color(:disable="!isAdmin" v-model="form.patternColor")
            .col
              q-input.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="50"
                outlined
                placeholder="#9376GJ9"
                ref="name"
                rounded
                v-model="form.patternColor"
              )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .full-width.items-start.q-mt-xl
          label.h-label Opacity
          .row.full-width.items-center.q-mt-sm
            .col-auto.q-mr-xs
              q-avatar(size="40px" :style="{'background': form.patternColor, 'opacity': form.patternOpacity / 100 }")
            .col
              q-slider(v-model="form.patternOpacity" :min="0" :max="100" :disable="!isAdmin")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

    div(v-if="tab==='SPLASHPAGE'").row.full-width.q-mt-xl
      .row.justify-center.items-center.full-width.q-my-xl
        .col-8.relative-position
          img(:src='previewSplashImage').relative-position.z-40
          .absolute-top-right.z-50.q-pa-xl
            q-btn.full-width.q-px-xl.rounded-border.text-bold(
              :disable="!isAdmin || form.splashBackgroundImage === undefined"
              @click="$refs.splashBackgroundImage.chooseFile()"
              color="white"
              text-color="primary"
              :label="form.splashBackgroundImage === undefined ? '...Uploading...' : 'Upload an image (max 3MB)'"
              no-caps
              rounded
              unelevated
            )
            input-file-ipfs(
              @uploading="form.splashBackgroundImage = undefined"
              @uploadedFile="form.splashBackgroundImage = arguments[0]"
              image
              ref="splashBackgroundImage"
              v-show="false"
            )

    div(v-if="tab==='BANNERS'").row.justify-between.full-width.q-mt-xl
      .full-width.items-start.q-mt-xl
        template(v-for="(banner, index) in banners")
          label.h-label {{banner.label}}
          base-banner.q-mt-sm(
            :title="form[banner.title]"
            :description="form[banner.paragraph]"
            :background="form[banner.image]"
            :pattern="form.patternBase64"
            :color="form.primaryColor"
          )
            template(#top-right)
              .q-pa-xl
                q-btn.full-width.q-px-xl.rounded-border.text-bold(
                  :disable="!isAdmin || banners[index].state === 'UPLOADING'"
                  @click="$refs.bannerImages[index].chooseFile()"
                  color="white"
                  :label="banners[index].state === 'UPLOADING' ? '...Uploading...' : 'Upload an image (max 3MB)'"
                  no-caps
                  rounded
                  text-color="primary"
                  unelevated
                )
                input-file-ipfs(
                  @uploading="banners[index].state = 'UPLOADING'"
                  @uploadedFile="form[banner.image] = arguments[0]; banners[index].state = 'FINISHED'"
                  image
                  ref="bannerImages"
                  v-show="false"
                )
            template(#right)
              .row(v-show="banner.key === 'PROPOSALS'")
                .col-6.q-pa-xxs
                  button-radio.full-height(
                    icon="fas fa-vote-yea"
                    title="Unity"
                    :subtitle="`${form.votingAlignmentPercent} %`"
                    description="Is the minimum required percentage of members endorsing a proposal for it to pass."
                    opacity
                    primary
                  )
                .col-6.q-pa-xxs
                  button-radio.full-height(
                    icon="fas fa-users"
                    title="Quorum"
                    :subtitle="`${form.votingQuorumPercent} %`"
                    description="Is the minimum required percentage of total members participating in the vote for it to pass. "
                    opacity
                    primary
                  )

          .row.full-width.justify-between.q-mt-sm
            .col-3.q-pr-sm
              label.h-label Title
              q-input.q-my-sm.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="50"
                outlined
                placeholder="Max 50 characters"
                ref="name"
                rounded
                v-model='form[banner.title]'
              )
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings
            .col-9.q-pl-sm
              label.h-label Short paragraph
              q-input.q-my-sm.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                :input-style="{ 'resize': 'none' }"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="140"
                outlined
                placeholder="Max 140 characters"
                ref="nickname"
                rounded
                rows='3'
                type="textarea"
                v-model='form[banner.paragraph]'
              )
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

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
      q-badge(v-show="numberOfChanges > 0" rounded color="red" :label="numberOfChanges" class="notification-badge" size='10px')
</template>

<style lang="stylus" scoped>

.h-asset
  height: 110px;

.svg-box
  width: 100%;
  height: 0;
  padding-top: 100%;
  position: relative;

.svg-box-content
  position: absolute;
  top: 0;
  left: 0;

.subtitle
  font-family: Lato, sans-serif !important
  font-size: 13px !important
  color: #84878E !important
  line-height:26px

.label
  font-family: Lato, sans-serif !important
  font-weight: 700
  font-size: 15px
  color: $primary

.button
  font-size: 13px;
  width: 40px
  height: 40px;

.rounded-border
  border-radius 15px

.border-b
  border-bottom 1px solid $internal-bg

.notification-badge
  position: absolute;
  z-index: 1000;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  font-size: 10px;
</style>
