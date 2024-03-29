<script>
import { Notify, copyToClipboard } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
import pick from '~/utils/pick.js'
import ipfsy from '~/utils/ipfsy'

const duration = {
  data() {
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
    isCustomDuration(duration) { return !this.durationOptions.map((_) => _.value).includes(duration) }
  },

  computed: {
    isCustomPeriodDuration() { return this.isCustomDuration(this.form.periodDurationSec) },
    isCustomVotingDuration() { return this.isCustomDuration(this.form.votingDurationSec) }
  }
}

const options = {
  computed: {
    DESIGN_TEMPLATES() {
      return [
        {
          key: 'ORGANIC',
          title: 'Organic',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
          primaryColor: '#43945c',
          secondaryColor: '#77c930',
          headerPattern: '/chains/telos_mainnet.png'
        },
        {
          key: 'TECH',
          title: 'Tech',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
          primaryColor: '#432D9C',
          secondaryColor: '#3FB8EE',
          headerPattern: '/chains/telos_mainnet.png'
        },
        {
          key: 'FINTECH',
          title: 'Fintech',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
          primaryColor: '#EC517B',
          secondaryColor: '#FF8A31',
          headerPattern: '/chains/telos_mainnet.png'
        },
        {
          key: 'CUSTOM',
          title: 'Custom',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
          primaryColor: 'white',
          secondaryColor: 'white',
          headerPattern: ''
        }
      ]
    },

    ORGANISATION_TEMPLATES() {
      return [
        {
          key: 1, // daoId
          icon: 'far fa-file',
          type: 'Payout',
          title: 'Organizations',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'

          // Role Archetypes (3)
          //       Salary Bands (7)
          //       Badges (5)
          //       Policies (9)
          //       Treasury (3)
        },
        {
          key: 2, // daoId
          icon: 'far fa-file',
          type: 'Payout',
          title: 'Villages',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
        },
        {
          key: 3, // daoId
          icon: 'far fa-file',
          type: 'Payout',
          title: 'Coops',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
        }
      ]
    },

    numberOfDigits() {
      return [
        { value: 1, label: '1,0' },
        { value: 2, label: '1,00' },
        { value: 3, label: '1,000' },
        { value: 4, label: '1,0000' }
      ]
    }
  }
}

function getRandomEOSName() {
  function choices(population, k) {
    const out = []
    for (let i = 0; i < k; i++) {
      out.push(population[Math.floor(population.length * Math.random())])
    }
    return out.join('')
  }
  const alphabet = 'abcdefghijklmnopqrstuvwxyz12345'
  return choices(alphabet, 12)
}

export default {
  name: 'dao-launcher',
  mixins: [validation, options, duration],
  components: {
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),

    Widget: () => import('~/components/common/widget.vue')

  },

  data() {
    return {
      activeStepIndex: 0,
      steps: [
        { index: 1, label: 'DAO Identity', key: 'IDENTITY', name: 'step-identity' },
        { index: 2, label: 'Token', key: 'TOKEN', name: 'step-token' },
        { index: 3, label: 'Design', key: 'DESIGN', name: 'step-design' }
      ],

      dao: null,

      error: null,
      state: 'DRAFTING', // DRAFTING, CREATING, CREATED, ADDING_ADMINS, FINISHED

      form: {
        // #
        name: getRandomEOSName(), // used internally to differentiate the DAO's. 12 characters, alphanumeric a-z, 1-5 lowercase
        title: '',
        description: '',

        // #
        template: -1, // i.e docId of the dao, -1 no template

        // #
        // Utility token (aka reward_token = utilityDigits utilitySymbol)
        utilityName: null,
        utilitySymbol: null,
        utilityDigits: 2, // 1.00
        utilityAmount: -1, // i.e 100000 or -1 for infinite supply
        utilityValue: '1', // The equivalent value of 1 token in USD
        // Voice token (aka voice_token = voiceDigits voiceSymbol)
        voiceSymbol: 'VOICE',
        voiceDigits: 2, // 1.00
        // Treasury token (aka peg_token = treasuryDigits treasurySymbol)
        treasuryName: null,
        treasurySymbol: null,
        treasuryDigits: 2, // 1.00
        use_seeds: false,

        // #
        member: '',
        members: [],

        // #
        votingDurationSec: 604800, // 1 week
        periodDurationSec: 604800, // 1 week
        votingAlignmentPercent: 80, // 80% of yes votes
        votingQuorumPercent: 20, // 20% of people needs to vote

        // #
        utilityTokenMultiplier: 1,
        voiceTokenMultiplier: 2,
        treasuryTokenMultiplier: 1,

        // salaries: [{ name: 'Band 1', value: 0 }],

        // #
        logo: '',
        primaryColor: '#242f5d',
        secondaryColor: '#3f64ee',
        textColor: '#ffffff'
      },
      pastSteps: ['step-identity']
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),

    activeStep() { return this.steps[this.activeStepIndex].key },
    isLastStep() { return this.activeStepIndex === this.steps.length - 1 },
    isImageSelected: {
      cache: false,
      get() { return this.$refs.ipfsInput?.imageURI }
    }
  },

  watch: {
    'form.title': {
      deep: true,
      handler(value) {
        // compute treasury symbol
        // if (value.length >= 3) {
        //   const _tokenName = `${value[0]}${value[1]}${value[value.length - 1]}`.toUpperCase()
        //   this.form.treasuryName = _tokenName
        //   this.form.treasurySymbol = _tokenName
        // }
      }
    }

  },

  methods: {
    ...mapActions('dao', ['createDAO', 'addAdmins']),
    ...mapActions('profiles', ['getPublicProfile']),

    isState(states) { return states.includes(this.state) },

    ipfsy,

    async isCurrentStepValid() {
      const dataForStep = {
        0: { ...pick(this.form, ['title', 'description']) },
        1: { ...pick(this.form, ['utilityName', 'utilitySymbol', 'utilityDigits', 'utilityAmount', 'utilityValue', 'voiceSymbol', 'voiceDigits', 'treasuryName', 'treasurySymbol', 'treasuryDigits']) },
        2: { ...pick(this.form, ['members']) },
        3: { ...pick(this.form, ['logo', 'primaryColor', 'secondaryColor']) }
      }

      return await this.validate(
        dataForStep[this.activeStepIndex]
      )
    },

    async onPreviousStep() {
      this.error = null

      if (this.activeStepIndex >= 0) {
        this.activeStepIndex = this.activeStepIndex - 1
      }
      this.scrollToNextStep(this.steps[this.activeStepIndex].name)
    },

    scrollToNextStep(nextStep) {
      if (!this.pastSteps.includes(nextStep)) {
        this.pastSteps.push(nextStep)
      }
      setTimeout(() => { document.getElementById(nextStep).scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 400)
    },

    async onNextStep(activeStepIndex) {
      this.error = null

      if (!(await this.isCurrentStepValid())) {
        return
      }

      if (this.activeStepIndex <= this.steps.length) {
        this.activeStepIndex = this.activeStepIndex + 1
      }
      switch (activeStepIndex) {
        case 0: this.scrollToNextStep('step-token')
          break
        case 1: this.scrollToNextStep('step-design')
      }
    },

    onGoToDashboard() {
      this.$router.push({ name: 'dashboard', params: { dhoname: this.dao.details_daoName_n } })
    },

    async onSubmit() {
      this.state = 'CREATING'
      const isDraft = !!this.$route.query.parentId

      try {
        await this.createDAO({
          data: {
            ...this.form,
            onboarder_account: this.account,
            parentId: this.$route.query.parentId
          },
          isDraft
        })

        const query = await this.$apollo.watchQuery({
          query: isDraft ? require('~/query/dao-draft-created.gql') : require('~/query/dao-created.gql'),
          pollInterval: 100,
          variables: isDraft ? { daoName: this.form.name } : { regexp: '/^' + this.form.name + '$/i' },
        })

        query.subscribe(({ data, loading }) => {
          const value = isDraft ? data.queryDaoDraft : data.queryDao
          if (value.length > 0) {
            const [result] = value
            if (result) {
              if (isDraft) {
                this.$router.push({ name: 'ecosystem', params: { refetch: true } })
                return
              }

              this.dao = { ...result }
              this.state = 'CREATED'
              query.stopPolling()
            }
          }
        })
      } catch (error) {
        this.error = error

        Notify.create({
          color: 'negative',
          icon: 'fas fa-exclamation-circle',
          message: error.message,
          position: 'bottom',
          timeout: 4000,
          actions: [
            { icon: 'fas fa-times', color: 'white', handler: () => { /* ... */ } }
          ]
        })

        this.state = 'DRAFTING'
      }
    },

    //

    async onAddAdmin() {
      try {
        await this.addAdmins({ daoId: this.dao.docId, users: [...this.form.members.map(_ => _.username)] })
        this.state = 'FINISHED'
      } catch (error) {
        this.error = error

        Notify.create({
          color: 'negative',
          icon: 'fas fa-exclamation-circle',
          message: error.message,
          position: 'bottom',
          timeout: 4000,
          actions: [
            { icon: 'fas fa-times', color: 'white', handler: () => { /* ... */ } }
          ]
        })
      }
    },

    async copyToClipboard() {
      try {
        await copyToClipboard(`${window.location.host}/${this.form.name}/login`)

        this.$q.notify({
          color: 'secondary',
          textColor: 'white',
          message: this.$t('messages.linkCopied'),
          icon: 'far fa-copy',
          timeout: 1000,
          actions: [{ icon: 'fas fa-times', color: 'white' }]
        })
      } catch (error) {
        this.$q.notify({
          color: 'negative',
          textColor: 'white',
          message: 'Error',
          timeout: 5000,
          actions: [{ icon: 'fas fa-times', color: 'white' }]
        })
      }
    },

    async addTeamMember() {
      if (this.form.members.find(obj => obj.username === this.form.member)) return
      const formCopy = { ...this.form, members: [] }
      if (!(await this.validate(formCopy))) return
      const user = await this.getPublicProfile(this.form.member)
      this.form.members.push({ username: this.form.member, avatar: user ? user?.publicData?.avatar : null, fullName: user ? user?.publicData?.name : null })
      this.form.member = ''
    },

    async removeTeamMember(username) {
      this.form.members = this.form.members.filter((obj) => obj.username !== username)
    },

    goToStep({ index }) {
      this.activeStepIndex = index
      if (this.$q.screen.gt.md) {
        this.scrollToNextStep(this.steps[this.activeStepIndex].name)
      }
    }
  },

  mounted() {
    this.$EventBus.$on('global:nav:back', this.onPreviousStep)
  },

  beforeDestroy() {
    this.$EventBus.$off('global:nav:back')
  }

}
</script>

<template lang="pug">
q-page.dao-launcher-page
  .fixed-full.row.justify-center.items-center(v-if="isState(['CREATING'])")
    loading-spinner(color="primary" size="72px")
  .row.justify-between.q-col-gutter-md.q-mb-xl
    .col-sm-12.col-md-12.col-lg-9
      section.row.items-stretch(v-if="isState(['CREATED'])")
        widget.full-width
          .row.full-width.items-center
            .col-auto
              q-avatar(size="160px" color="primary" text-color="white")
                span(v-show="!form.logo") {{ form.title ? form.title[0] : '' }}
                img(v-show="form.logo" :src="ipfsy(form.logo)")
            .col.q-pl-xl
              label.h-h4 {{ this.form.title }}
              p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md {{this.form.description}}
          .row.justify-end.q-mt-md
            q-btn.q-px-xl(@click="onGoToDashboard" color="primary" :label="$t('pages.onboarding.goToDashboard')" no-caps rounded unelevated)
        .row.items-stretch.q-mt-md(:class="{ 'q-pr-xs': $q.screen.gt.md }")
          div(:style="{'height': 'auto'}" :class="{ 'col-6 q-pr-xs': $q.screen.gt.md }")
            widget
              .row.justify-between
                div
                  p.q-ma-none.h-label.text-h-gray.text-weight-300 {{ $t('pages.onboarding.optionalStep') }}
                  label.h-h4 {{ $t('pages.onboarding.inviteMembers') }}
                  p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md(:style="{'min-height':'48px'}") {{ $t('pages.onboarding.youReInTheEndGame') }}
                .row.full-width.justify-end
                  q-btn.q-px-xl(@click="copyToClipboard" color="primary" label="Copy Public Link" no-caps outline rounded unelevated)
          div(:style="{'height': 'auto'}" :class="{ 'col-6 q-pl-xs': $q.screen.gt.md, 'q-mt-md': $q.screen.lt.md || $q.screen.md }")
            widget
              .row.justify-between
                div
                  p.q-ma-none.h-label.text-h-gray.text-weight-300 {{ $t('pages.onboarding.optionalStepTelosAccount') }}
                  label.h-h4 {{ $t('pages.onboarding.launchTeam') }}
                  p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md(:style="{'min-height':'48px'}") {{ $t('pages.onboarding.createATeamOfMembersWithAdmin') }}
                .row.full-width.justify-end
                  q-btn.q-px-xl(@click="state = 'ADDING_ADMINS'" color="primary" :label="$t('pages.onboarding.createLaunchTeam')" no-caps outline rounded unelevated)
      template(v-if="isState(['DRAFTING'])")
        widget#step-identity.q-mb-md(v-if="$q.screen.gt.md ? pastSteps.includes('step-identity') : activeStep === 'IDENTITY'" :class="{ 'disabled': (activeStep !== 'IDENTITY') && $q.screen.gt.md, 'ghost-margin-bottom': pastSteps.slice(-1)[0] === 'step-identity' }")
          label.h-h4 {{ $t('pages.onboarding.daoIndentity') }}
          p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md {{ $t('pages.onboarding.youCanAddYourDaoName') }}
          .row.full-width.justify-between.q-mt-xl
            .col-7(:class="{ 'full-width': !$q.screen.gt.md, 'q-pr-md': $q.screen.gt.md }")
              label.h-label {{ $t('pages.onboarding.name') }}
              q-input.q-mt-xs.rounded-border(:rules="[rules.required, rules.min(3)]" dense lazy-rules="ondemand" maxlength="50" outlined :placeholder="$t('pages.onboarding.theDisplayNameOfYourDao')" ref="title" v-model="form.title")
            .col-5(:class="{ 'full-width q-pt-md': !$q.screen.gt.md }")
              .row.justify-center.items-center
                .col-auto
                  q-avatar(:size="$q.screen.gt.md ? '80px' :'60px' " color="primary" text-color="white")
                    q-btn(v-if="!isImageSelected" @click="$refs.ipfsInput.chooseFile()" icon="fa fa-image" color="white" flat padding="30px" round size="xl" unelevated)
                    img(v-if="isImageSelected" :src="$refs.ipfsInput.imageURI")
                .col.q-ml-md
                  label.h-label {{ $t('pages.onboarding.logoIcon') }}
                  q-btn.full-width.rounded-border.text-bold.q-mt-xs(:class="{ 'q-px-xl': $q.screen.gt.md }" @click="$refs.ipfsInput.chooseFile()" color="primary" :label="$t('pages.onboarding.uploadAnImage')" no-caps outline rounded unelevated)
                  input-file-ipfs(@uploadedFile="form.logo = arguments[0] " image="image" ref="ipfsInput" v-show="false")
            .col-12.q-mt-md(:class="{ 'full-width': !$q.screen.gt.md }")
              label.h-label {{ $t('pages.onboarding.purpose') }}
              q-input.q-mt-xs.rounded-border(:input-style="{ 'resize': 'none' }" :rules="[rules.required]" dense lazy-rules="ondemand" maxlength="300" outlined :placeholder="$t('pages.onboarding.brieflyExplainWhatYourDao')" ref="description" rows="10" type="textarea" v-model="form.description")
          nav.row.justify-end.q-mt-xl.q-gutter-xs
            q-btn.q-px-xl(@click="onNextStep(activeStepIndex)" color="primary" :label="$t('pages.onboarding.nextStep')" no-caps rounded unelevated v-if="$q.screen.gt.md")
        widget#step-token.q-mb-md(:class="{ 'disabled': (activeStep !== 'TOKEN') && $q.screen.gt.md, 'ghost-margin-bottom': pastSteps.slice(-1)[0] === 'step-token' }" v-if="$q.screen.gt.md ? pastSteps.includes('step-token') : activeStep === 'TOKEN'")
          .row
            q-avatar.q-mr-xs(size="30px")
              img(src="~assets/icons/token-utility-icon.svg")
            label.h-h4 {{ $t('pages.onboarding.utilityToken') }}
          p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md {{ $t('pages.onboarding.theUtilityTokenThatRepresents') }}
          .row.full-width.justify-between.q-mt-xl
            .col-8(:class="{ 'full-width': !$q.screen.gt.md, 'q-pr-md': $q.screen.gt.md }")
              label.h-label {{ $t('pages.onboarding.name') }}
                q-input.q-mt-xs.rounded-border(:debounce="200" :rules="[rules.required, rules.min(1), rules.max(20)]" bg-color="white" dense lazy-rules="ondemand" maxlength="20" outlined :placeholder="$t('pages.onboarding.max20CharactersExBitcoin')" ref="utilityName" rounded v-model="form.utilityName")
            .col-4(:class="{ 'full-width': !$q.screen.gt.md, '': $q.screen.gt.md }")
              label.h-label {{ $t('pages.onboarding.symbol') }}
              q-input.q-mt-xs.rounded-border(:debounce="200" :rules="[rules.required, rules.isTokenAvailable]" bg-color="white" dense lazy-rules="ondemand" mask="AAAAAAAA" maxlength="7" outlined :placeholder="$t('pages.onboarding.max7CharactersExBTC')" ref="utilitySymbol" rounded v-model="form.utilitySymbol")
          .row.q-mt-xl
            q-avatar.q-mr-xs(size="30px")
              img(src="~assets/icons/token-treasury-icon.svg")
            label.h-h4 {{ $t('pages.onboarding.treasuryToken') }}
          p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md {{ $t('pages.onboarding.theTreasuryTokenIsAPromise') }}
          .row.full-width.justify-between.q-mt-xl
            .col-8(:class="{ 'full-width': !$q.screen.gt.md, 'q-pr-md': $q.screen.gt.md }")
              label.h-label {{ $t('pages.onboarding.name') }}
                q-input.q-mt-xs.rounded-border(:debounce="200" :rules="[rules.required, rules.min(1), rules.max(20)]" bg-color="white" dense lazy-rules="ondemand" maxlength="20" outlined :placeholder="$t('pages.onboarding.max20CharactersExBitcoin')" ref="utilityName" rounded v-model="form.treasuryName")
            .col-4(:class="{ 'full-width': !$q.screen.gt.md, '': $q.screen.gt.md }")
              label.h-label {{ $t('pages.onboarding.symbol') }}
              q-input.q-mt-xs.rounded-border(:debounce="200" :rules="[rules.required, rules.isTokenAvailable]" bg-color="white" dense lazy-rules="ondemand" mask="AAAAAAAA" maxlength="7" outlined :placeholder="$t('pages.onboarding.max7CharactersExBTC')" ref="treasurySymbol" rounded v-model="form.treasurySymbol")
          nav.row.justify-end.q-mt-xl.q-gutter-xs
            q-btn.q-px-xl(@click="onPreviousStep()" color="primary" :label="'Back'" no-caps rounded flat v-if="$q.screen.gt.md")
            q-btn.q-px-xl(@click="onNextStep(activeStepIndex)" color="primary" :label="$t('pages.onboarding.nextStep')" no-caps rounded unelevated v-if="$q.screen.gt.md")
        widget#step-design(:class="{ 'disabled': (activeStep !== 'DESIGN') && $q.screen.gt.md, 'ghost-margin-bottom': pastSteps.slice(-1)[0] === 'step-design' }" v-if="$q.screen.gt.md ? pastSteps.includes('step-design') : activeStep === 'DESIGN'")
          label.h-h4 {{ $t('pages.onboarding.design') }}
          p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md {{ $t('pages.onboarding.setUpYourDaoBrand') }}
          .row.items-center.q-col-gutter-md.q-mt-xl
            .col-4(:class="{ 'full-width': !$q.screen.gt.sm }")
              label.h-label {{ $t('pages.onboarding.primaryColor') }}
              .row.full-width.q-my-sm.items-center
                .col-auto.q-mr-xs
                  q-avatar(size="40px" :style="{'background': form.primaryColor}")
                    q-popup-proxy(cover="cover" transition-show="scale" transition-hide="scale")
                      q-color(v-model="form.primaryColor")
                .col
                  q-input.rounded-border(:debounce="200" bg-color="white" dense lazy-rules maxlength="50" outlined placeholder="#9376GJ9" ref="primaryColor" rounded v-model="form.primaryColor")
            .col-4(:class="{ 'full-width': !$q.screen.gt.sm }")
              label.h-label {{ $t('pages.onboarding.secondaryColor') }}
              .row.full-width.q-my-sm.items-center
                .col-auto.q-mr-xs
                  q-avatar(size="40px" :style="{'background': form.secondaryColor}")
                    q-popup-proxy(cover="cover" transition-show="scale" transition-hide="scale")
                      q-color(v-model="form.secondaryColor")
                .col
                  q-input.rounded-border(:debounce="200" bg-color="white" dense lazy-rules maxlength="50" outlined placeholder="#9376GJ9" ref="secondaryColor" rounded v-model="form.secondaryColor")
            .col-4(:class="{ 'full-width': !$q.screen.gt.sm }")
              label.h-label {{ $t('pages.onboarding.buttonTextColor') }}
              .row.full-width.q-my-sm.items-center
                .col-auto.q-mr-sm
                  q-avatar(size="40px" v-bind:style="{'background': form.textColor, 'border': form.textColor === '#ffffff' ? '1px solid #A3A5AA' : ''}")
                    q-popup-proxy(cover="cover" transition-show="scale" transition-hide="scale")
                      q-color(v-model="form.textColor")
                .col
                  q-input.rounded-border(:debounce="200" bg-color="white" dense lazy-rules maxlength="50" outlined placeholder="#ffffff" ref="textColor" rounded v-model="form.textColor")
            .col-12.row
              .full-width
                label.h-label {{ $t('pages.onboarding.preview') }}
              .row(:class="{ 'full-width q-mt-md': !$q.screen.gt.sm, 'col-auto q-pr-md': $q.screen.gt.sm }")
                q-avatar.q-mr-xs(size="80px" :style="{'background': form.primaryColor, 'color': form.textColor }")
                  span {{ form.title ? form.title[0] : 'D' }}
                q-avatar(size="80px" :style="{'background': form.secondaryColor, 'color': form.textColor }")
                  span {{ form.title ? form.title[0] : 'D' }}
              .row(:class="{ 'full-width': !$q.screen.gt.sm, 'col': $q.screen.gt.sm }")
                .col-4(:class="{ 'full-width q-mt-md': !$q.screen.gt.sm, 'q-pr-md': $q.screen.gt.sm }")
                  q-btn.q-px-xl.full-width(:style="{'background': form.primaryColor, 'color': form.textColor}" label="Primary color" no-caps rounded unelevated)
                .col-4(:class="{ 'full-width q-mt-md': !$q.screen.gt.sm, 'q-pr-md': $q.screen.gt.sm }")
                  q-btn.q-px-xl.full-width(:style="{'background': form.secondaryColor, 'color': form.textColor }" :label="$t('pages.onboarding.secondaryColor')" no-caps rounded unelevated)
                .col-4(:class="{ 'full-width q-mt-md': !$q.screen.gt.sm, '': $q.screen.gt.sm }")
                  q-btn.q-px-xl.full-width(:style="{'color': form.primaryColor}" label="Primary color" no-caps outline rounded unelevated)
          nav.row.justify-end.q-mt-xl.q-gutter-xs
            q-btn.q-px-xl(@click="onPreviousStep()" color="primary" :label="'Back'" no-caps rounded flat v-if="$q.screen.gt.md")
            q-btn.q-px-xl(@click="onSubmit()" color="primary" :label="'Publish'" no-caps rounded unelevated v-if="$q.screen.gt.md")
      widget(v-if="isState(['ADDING_ADMINS','FINISHED'])")
        label.h-h4 {{ $t('pages.onboarding.launchTeam') }}
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md {{ $t('pages.onboarding.createATeamOfCoreMembersWithAdmin') }}
        .row.full-width.justify-between.q-mt-xl
          .full-width(v-if="isState(['ADDING_ADMINS'])")
            label.h-label {{ $t('pages.onboarding.telosAccount') }}
            q-input.q-mt-xs.q-pa-none.rounded-border(:debounce="200" :ref="'member'" :rules="[rules.required, rules.accountFormatBasic, rules.accountLength, rules.accountExists]" bg-color="white" dense lazy-rules="ondemand" maxlength="12" outlined placeholder="Type account here and press enter" rounded v-model="form.member" v-on:keyup.enter="addTeamMember")
            nav.row.full-width.justify-end.q-mt-xs
              q-btn.text-bold.q-pa-none.q-ml-lg.q-mr-xs(flat color="primary" no-caps padding="none" @click="addTeamMember") {{ $t('pages.onboarding.addToTheTeam') }}
          .row.full-width.q-mt-xl
            template(v-for="(member, index) in form.members")
              .col-4.q-mt-md.q-px-md
                .q-pa-sm.rounded-border.row.items-center.relative.member-item(:style="{'border': '1px solid var(--q-color-primary)'}")
                  q-btn.absolute-top-right.q-pa-xxs.z-50(@click="() => removeTeamMember(member.username)" color="body" flat icon="fas fa-times" round size="sm")
                  q-avatar.q-mr-xs(size="xl" :style="{'background': form.primaryColor, 'color': form.textColor }")
                    img.object-cover(:src="member.avatar" v-if="member.avatar")
                    span {{ member && member.username[0] }}
                  div
                    label.h-label {{ member.fullName ? member.fullName : `@${member.username}` }}
                    p.q-pa-none.q-ma-none.font-sans.text-xs.text-weight-500.text-h-gray(v-if="member.fullName") @
                      | {{member.username}}
        nav.row.justify-end.q-mt-xl.q-gutter-xs
          q-btn.q-px-xl(@click="onGoToDashboard" color="primary" :label="$t('pages.onboarding.goToDashboard')" no-caps outline rounded unelevated)
          q-btn.q-px-xl(@click="onAddAdmin" color="primary" label="Save Team" no-caps rounded unelevated v-if="isState(['ADDING_ADMINS'])")
    .col-sm-12.col-md-12.col-lg-3(:class="{ 'full-width': $q.screen.lt.md || $q.screen.md }")
      widget(v-if="isState(['CREATED'])")
        .row
          q-avatar.q-mr-sm(size="30px" color="white" text-color="primary" :style="{'border': '1px solid var(--q-color-primary)'}")
            .row.justify-center.items-center.full-width.text-center
              q-icon(center="center" size="10px" name="fas fa-check")
          label.h-h4 {{ $t('pages.onboarding.daoPublished') }}
      div(v-if="isState(['DRAFTING'])" :class="{ 'sticky': $q.screen.gt.md }" :style="[($q.screen.lt.md || $q.screen.md) ? {'border-radius': '25px', 'box-shadow': 'none', 'z-index': '7000', 'position': 'fixed', 'bottom': '-20px', 'left': '0', 'right': '0', 'box-shadow': '0px 0px 26px 0px rgba(0, 0, 41, 0.2)'} : {}]")
        creation-stepper(:activeStepIndex="activeStepIndex" :steps="steps" @goToStep="goToStep" @publish="onSubmit" @next="onNextStep")

</template>

<style lang="stylus" scoped>
.member-item
  position: relative
.disabled
  opacity: 20% !important
  pointer-events: none
  border-radius: 26px
.ghost-margin-bottom
  margin-bottom: 20%
</style>
