<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
import pick from '~/utils/pick.js'

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
    isCustomPeriodDuration () { return this.isCustomDuration(this.form.periodDurationSec) },

    isCustomVotingDuration () { return this.isCustomDuration(this.form.votingDurationSec) }
  }
}

const options = {
  computed: {
    DESIGN_TEMPLATES () {
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

    ORGANISATION_TEMPLATES () {
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

    numberOfDigits () {
      return [
        { value: 1, label: '1,0' },
        { value: 2, label: '1,00' },
        { value: 3, label: '1,000' },
        { value: 4, label: '1,0000' }
      ]
    }
  }
}

export default {
  name: 'dho-creation',
  mixins: [validation, options, duration],
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue'),
    CustomPeriodInput: () => import('~/components/form/custom-period-input.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      activeStepIndex: 0,
      steps: [
        { index: 0, label: 'General Info', key: 'GENERAL_INFO' },
        { index: 1, label: 'Token', key: 'TOKEN' },
        { index: 2, label: 'Launch Team', key: 'LAUNCH_TEAM' },
        // { index: 3, label: 'Voting', key: 'VOTING' },
        // { index: 4, label: 'Compensation', key: 'COMPENSATION' },
        // { index: 5, label: 'Templates', key: 'TEMPLATES' },
        { index: 6, label: 'Design', key: 'DESIGN' }
      ],

      error: null,
      loading: false,
      submitting: false,

      form: {
        // # STEP 1
        name: '',
        title: '',
        description: '',

        // # STEP 2
        template: -1, // i.e docId of the dao, -1 no template

        // # STEP 3
        reward_token: null, // Utility token
        utilitySymbol: null,
        utilityDigits: 3, // 1.000
        utilityAmount: -1, // i.e 100000 or -1 for infinite supply
        utilityValue: 0,
        voice_token: null, // Voice token
        voiceSymbol: 'VOICE',
        voiceDigits: 3, // 1.000
        peg_token: null, // Treasury token
        treasurySymbol: null,
        treasuryDigits: 3, // 1.000
        use_seeds: false,

        // # STEP 4
        members: [{ name: '', email: '', account: '', discord: '' }],

        // # STEP 5
        votingDurationSec: 604800, // 1 week
        periodDurationSec: 604800, // 1 week
        votingAlignmentPercent: 80, // 80% of yes votes
        votingQuorumPercent: 20, // 20% of people needs to vote

        // # STEP 6
        utilityTokenMultiplier: 1,
        voiceTokenMultiplier: 2,
        treasuryTokenMultiplier: 1,

        salaries: [{ name: 'Band 1', value: 0 }],

        // # STEP 7
        logo: '',
        primaryColor: '#242f5d',
        secondaryColor: '#3f64ee'
      }
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('profiles', ['isConnected']),

    activeStep () { return this.steps[this.activeStepIndex].key },
    lastStep () { return this.activeStepIndex === this.steps.length - 1 }
  },

  watch: {
    'form.name': {
      deep: true,
      handler (value) {
        // compute treasury symbol
        if (value.length > 3) {
          this.form.treasurySymbol = `${value[0]}${value[1]}${value[value.length - 1]}`.toUpperCase()
        }
        // setup title
        this.title = value
      }
    }
  },

  methods: {
    ...mapActions('dao', ['createDAO']),

    capitalizeFirstLetter: (str) => {
      return (
        str.charAt(0).toUpperCase() +
        str.replace('_', ' ').toLowerCase().slice(1)
      )
    },

    async onPrevStep () {
      if (this.activeStepIndex >= 0) {
        this.activeStepIndex = this.activeStepIndex - 1
      }
    },

    async onNextStep () {
      if (!(await this.canClickNext())) {
        return
      }

      if (this.lastStep) {
        try {
          this.submitting = true
          await this.createDAO({ data: { ...this.form, onboarder_account: this.account } })
        } catch (error) {
          this.error = error
        }
      } else {
        this.activeStepIndex = this.activeStepIndex + 1
      }

      this.submitting = false
    },

    async canClickNext () {
      const dataForValidation = {
        0: { ...pick(this.form, ['title', 'description']) },
        1: { ...pick(this.form, ['utilitySymbol', 'utilityDigits', 'utilityAmount', 'utilityValue', 'voiceSymbol', 'voiceDigits', 'treasurySymbol', 'treasuryDigits']) },
        2: { ...pick(this.form, ['members']) },
        3: { ...pick(this.form, ['logo', 'primaryColor', 'secondaryColor']) }
        // 3: { ...pick(this.form, ['votingDurationSec', 'periodDurationSec', 'votingAlignmentPercent', 'votingQuorumPercent']) },
        // 4: { ...pick(this.form, ['utilityTokenMultiplier', 'voiceTokenMultiplier', 'treasuryTokenMultiplier', 'salaries']) }
        // 5: { ...pick(this.form, ['template']) }
        // 6: { ...pick(this.form, ['design']) },
      }

      // await this.resetValidation(form)
      return await this.validate(
        dataForValidation[this.activeStepIndex]
      )
    },

    onImageUploaded (cid) {
      this.form.logo = cid
    }
  }
}
</script>

<template lang="pug">
.row.justify-between
  .column.col-xs-12.col-sm-9.col-md-9.q-pr-md
    widget
      //- STEP 1
      section.row(v-show="activeStep === 'GENERAL_INFO'")
        label.h-h4 General info
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
        .row.full-width.justify-between.q-mt-sm
          .col-12
            label.h-label Organization name
            q-input.q-mt-xs.rounded-border(
              :rules="[rules.required]"
              dense
              lazy-rules="ondemand"
              maxlength="50"
              outlined
              placeholder="The display name of your organization (max. 50 character)"
              ref="name"
              v-model="form.name"
            )
          .col-12
            label.h-label Organization purpose
            q-input.q-mt-xs.rounded-border(
              :input-style="{ 'resize': 'none' }"
              :rules="[rules.required]"
              dense
              lazy-rules="ondemand"
              outlined
              placeholder="Briefly explain what your DAO is all about (max. 300 characters)"
              ref="description"
              rows='10'
              type="textarea"
              v-model="form.description"
            )

      //- STEP 2
      section.column.full-width(v-show="activeStep === 'TOKEN'")
        label.h-h4 Token
        .row.full-width.justify-between.q-mt-sm
          .col-12.q-pr-xs
            label.h-label Name your Token
            q-input.q-mt-xs.rounded-border(
                  :debounce="200"
                  :rules="[rules.required]"
                  bg-color="white"
                  color="accent"
                  dense
                  lazy-rules="ondemand"
                  mask="AAAAAAAA"
                  maxlength="7"
                  outlined
                  placeholder="Utility Token Name (max 7 characters, uppercase A-Z)"
                  ref="utilitySymbol"
                  rounded
                  v-model="form.utilitySymbol"
                )
        //- .row
        //-   q-avatar(size='30px').q-mr-xs
        //-     img(src="~assets/icons/token-utility-icon.svg")
        //-   label.h-h4 Utility token
        //- p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        //- .row.full-width.justify-between.q-mt-sm
        //-   .col-8.q-pr-xs
        //-     label.h-label Symbol
        //-     q-input.q-mt-xs.rounded-border(
        //-           :debounce="200"
        //-           :rules="[rules.required]"
        //-           bg-color="white"
        //-           color="accent"
        //-           dense
        //-           lazy-rules="ondemand"
        //-           mask="AAAAAAAA"
        //-           maxlength="7"
        //-           outlined
        //-           placeholder="Max 7 characters uppercase A-Z"
        //-           ref="utilitySymbol"
        //-           rounded
        //-           v-model="form.utilitySymbol"
        //-         )
        //-   .col-4
        //-     label.h-label Number of Digits
        //-     q-select.q-mt-xs.rounded-border(
        //-         :options="numberOfDigits"
        //-         :rules="[rules.required]"
        //-         bg-color="white"
        //-         dense
        //-         emit-value,
        //-         fill-input
        //-         hide-selected
        //-         map-options
        //-         option-label="label"
        //-         option-value="value"
        //-         outlined
        //-         placeholder=""
        //-         ref="utilityDigits"
        //-         rounded
        //-         use-input
        //-         v-model='form.utilityDigits'
        //-       )

        //- .row.full-width.justify-between
        //-   .col-6.q-pr-xs
        //-     label.h-label Total amount
        //-     q-input.q-mt-xs.rounded-border(
        //-           :debounce="200"
        //-           :rules="[rules.required]"
        //-           bg-color="white"
        //-           color="accent"
        //-           dense
        //-           lazy-rules="ondemand"
        //-           outlined
        //-           placeholder=""
        //-           ref="utilityAmount"
        //-           rounded
        //-           type='number'
        //-           v-model="form.utilityAmount"
        //-         )
        //-   .col-6
        //-     label.h-label Value
        //-     q-input.q-mt-xs.rounded-border(
        //-           :debounce="200"
        //-           :rules="[rules.required]"
        //-           bg-color="white"
        //-           color="accent"
        //-           dense
        //-           lazy-rules="ondemand"
        //-           outlined
        //-           placeholder=""
        //-           ref="utilityValue"
        //-           rounded
        //-           type='number'
        //-           v-model="form.utilityValue"
        //-         )

        //- .row.q-mt-xl
        //-   .row
        //-     q-avatar(size='30px').q-mr-xs
        //-       img(src="~assets/icons/token-voice-icon.svg")
        //-     label.h-h4 Voice token
        //-   p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        //-   .row.full-width.justify-between.q-mt-sm
        //-     .col-8.q-pr-xs
        //-       label.h-label Symbol
        //-       q-input.q-mt-xs.rounded-border(
        //-             :debounce="200"
        //-             :rules="[rules.required]"
        //-             bg-color="white"
        //-             color="accent"
        //-             dense
        //-             lazy-rules="ondemand"
        //-             mask="AAAAAAAA"
        //-             maxlength="7"
        //-             outlined
        //-             placeholder="Max 7 characters uppercase A-Z"
        //-             ref="voiceSymbol"
        //-             rounded
        //-             v-model="form.voiceSymbol"
        //-           )
        //-     .col-4
        //-       label.h-label Number of Digits
        //-       q-select.q-mt-xs.rounded-border(
        //-           :options="numberOfDigits"
        //-           :rules="[rules.required]"
        //-           bg-color="white"
        //-           dense
        //-           emit-value,
        //-           fill-input
        //-           hide-selected
        //-           map-options
        //-           option-label="label"
        //-           option-value="value"
        //-           outlined
        //-           placeholder=""
        //-           ref="voiceDigits"
        //-           rounded
        //-           use-input
        //-           v-model='form.voiceDigits'
        //-         )

        //- .row.q-mt-xl
        //-   .row
        //-     q-avatar(size='30px').q-mr-xs
        //-       img(src="~assets/icons/token-treasury-icon.svg")
        //-     label.h-h4 Treasury token
        //-   p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        //-   .row.full-width.justify-between.q-mt-sm
        //-     .col-8.q-pr-xs
        //-       label.h-label Symbol
        //-       q-input.q-mt-xs.rounded-border(
        //-             :debounce="200"
        //-             :rules="[rules.required]"
        //-             bg-color="white"
        //-             color="accent"
        //-             dense
        //-             lazy-rules="ondemand"
        //-             mask="AAAAAAAA"
        //-             maxlength="7"
        //-             outlined
        //-             placeholder="Max 7 characters uppercase A-Z"
        //-             ref="treasurySymbol"
        //-             rounded
        //-             v-model="form.treasurySymbol"
        //-           )
        //-     .col-4
        //-       label.h-label Number of Digits
        //-       q-select.q-mt-xs.rounded-border(
        //-           :options="numberOfDigits"
        //-           :rules="[rules.required]"
        //-           bg-color="white"
        //-           dense
        //-           emit-value,
        //-           fill-input
        //-           hide-selected
        //-           map-options
        //-           option-label="label"
        //-           option-value="value"
        //-           outlined
        //-           placeholder=""
        //-           ref="treasuryDigits"
        //-           rounded
        //-           use-input
        //-           v-model='form.treasuryDigits'
        //-         )

        //- .row.q-mt-xl
        //-   label.h-h4 Additional token
        //-   p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        //-   .row.full-width.justify-between.q-mt-sm
        //-     .row.full-width
        //-       .row.col
        //-         q-avatar(size="30px")
        //-           img(:src="require('~/assets/icons/seeds.png')")
        //-         div.q-mx-sm.col
        //-           p.q-pa-none.q-ma-none.font-lato.text-heading.text-xs.text-weight-700 Seeds
        //-           p.q-pa-none.q-ma-none.font-sans.text-xs(:style="{'color':'#84878E'}") Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        //-       div
        //-         q-toggle(v-model="form.use_seeds")

      //- STEP 3
      section.column.full-width.q-mb-xl(v-show="activeStep === 'LAUNCH_TEAM'")
        label.h-h4 Launch team
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md The initial launch team is critical for your DAO. The people you list here will have access to configure the DAO, create proposals and enroll other members. Make sure to provide us with the emails of the launch team - in case they do not have a Telos account yet, we can send them a link to create an account. This makes it easier for you and your team to get started from day 1.
        template(v-for="(member, index) in form.members")
          .row.full-width.justify-between.q-col-gutter-xs
            .col-3.q-pr-xs
              label.h-label Name
              q-input.q-mt-xs.q-pa-none.rounded-border(
                    :debounce="200"
                    :rules="[rules.required]"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules="ondemand"
                    maxlength="50"
                    outlined
                    placeholder="Type name here"
                    rounded
                    :ref="'members.' + index + '.name'"
                    v-model="member.name"
                  )
            .col-3
              label.h-label Email
              q-input.q-mt-xs.q-pa-none.rounded-border(
                    :debounce="200"
                    :rules="[rules.required]"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules="ondemand"
                    maxlength="50"
                    outlined
                    placeholder="Type email here"
                    rounded
                    :ref="'members.' + index + '.email'"
                    v-model="member.email"
                  )
            .col-3
              label.h-label Telos/SEEDS account
              q-input.q-mt-xs.q-pa-none.rounded-border(
                    :debounce="200"
                    :rules="[rules.required]"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules="ondemand"
                    maxlength="50"
                    outlined
                    placeholder="Type account here"
                    rounded
                    :ref="'members.' + index + '.account'"
                    v-model="member.account"
                  )
            .col-3
              label.h-label Discord
              q-input.q-mt-xs.q-pa-none.rounded-border(
                    :debounce="200"
                    :rules="[rules.required]"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules="ondemand"
                    maxlength="50"
                    outlined
                    placeholder="Type discord here"
                    rounded
                    :ref="'members.' + index + '.discord'"
                    v-model="member.discord"
                  )
            nav.row.full-width.justify-end.q-mt-xs
              q-btn(:disable="index === 0" flat color="primary" no-caps padding="none" @click="form.members.splice(index, 1)").text-bold.q-pa-none.q-mr-xs Remove account -
              q-btn(:disable="form.members.length === 10" v-show="index === form.members.length - 1" flat color="primary" no-caps padding="none" @click="form.members.push({account:'',email:''})").text-bold.q-pa-none.q-ml-lg.q-mr-xs Add more +

      //- STEP 4
      //- section.row(v-show="activeStep === 'TEMPLATES'")
      //-   label.h-h4 Templates
      //-   p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      //-   .row.items-stretch.q-col-gutter-xs.q-mt-md
      //-     template(v-for="opts in ORGANISATION_TEMPLATES")
      //-       .col-4
      //-         button-radio.full-height(
      //-           :icon="opts.icon"
      //-           :selected="opts.key === form.template"
      //-           :title="opts.title"
      //-           :description="opts.description"
      //-           :disable="opts.disable"
      //-           @click="form.template = opts.key"
      //-         )
      //-           div.full-width.text-left.q-mt-lg
      //-             p.font-sans.text-weight-700.text-xs Role Archetypes (3)
      //-             p.font-sans.text-weight-700.text-xs Salary Bands (7)
      //-             p.font-sans.text-weight-700.text-xs Badges (5)
      //-             p.font-sans.text-weight-700.text-xs Policies (9)
      //-             p.font-sans.text-weight-700.text-xs Treasury (3)

      //-           div.full-width.row.justify-between
      //-             q-btn.col-6(
      //-               :color="opts.key === form.template ? 'white' :'primary'"
      //-               :disable="submitting"
      //-               :label="opts.key === form.template ? 'Selected' :'Select'"
      //-               :loading="submitting"
      //-               :text-color="opts.key === form.template ? 'primary' :'white'"
      //-               @click="form.template = opts.key"
      //-               no-caps
      //-               rounded
      //-               unelevated
      //-             )
      //-             q-btn.col-6(
      //-               :disable="submitting"
      //-               @click="form.template = opts.key"
      //-               color="primary"
      //-               label="Learn more"
      //-               no-caps
      //-               flat
      //-               rounded
      //-               unelevated
      //-               v-show="activeStepIndex > 0"
      //-             )

      //- STEP 5
      //- section.column.full-width.q-mb-xl(v-show="activeStep === 'VOTING'")
      //-   label.h-h4 Voting
      //-   p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      //-   .row.q-my-xl.full-width
      //-     .col-8.row.q-pr-sm
      //-       .row.items-end.full-width
      //-         label.h-label.full-width Vote duration
      //-         .q-mt-xs.row.full-width
      //-           .col-7.row.justify-between.q-mr-sm
      //-             q-btn.button.text-bold.text-lowercase(
      //-               :color="form.votingDurationSec === option.value ? 'primary' : 'internal-bg'"
      //-               :key='index'
      //-               :text-color="form.votingDurationSec === option.value ? 'white' : 'primary'"
      //-               @click="form.votingDurationSec = option.value"
      //-               padding="none"
      //-               rounded
      //-               unelevated
      //-               v-for='(option, index) in durationOptions'
      //-             ) {{ option.label }}
      //-           .col-grow
      //-             custom-period-input(:isActive="isCustomVotingDuration" @selected="form.votingDurationSec = 0" v-model='form.votingDurationSec')

      //-     .col-8.row.q-pr-sm.q-mt-xl
      //-       .row.items-end.full-width
      //-         label.h-label.full-width Period duration
      //-         .q-mt-xs.row.full-width
      //-           .col-7.row.justify-between.q-mr-sm
      //-             q-btn.button.text-bold.text-lowercase(
      //-               :color="form.periodDurationSec === option.value ? 'primary' : 'internal-bg'"
      //-               :key='index'
      //-               :text-color="form.periodDurationSec === option.value ? 'white' : 'primary'"
      //-               @click="form.periodDurationSec = option.value"
      //-               padding="none"
      //-               rounded
      //-               unelevated
      //-               v-for='(option, index) in durationOptions'
      //-             ) {{ option.label }}
      //-           .col-grow
      //-             custom-period-input(:isActive="isCustomVotingDuration" @selected="form.periodDurationSec = 0" v-model='form.periodDurationSec')

      //-     .col-6.row.q-pl-sm
      //-       //- .row.items-end.full-width
      //-       //-   label.h-label.full-width Period duration
      //-       //-   .q-mt-xs.row.full-width
      //-       //-     .col-7.row.justify-between.q-mr-sm
      //-       //-       q-btn.button.text-bold.text-lowercase(
      //-       //-         :color="form.periodDurationSec === option.value ? 'primary' : 'internal-bg'"
      //-                           :key='index'
      //-       //-         :text-color="form.periodDurationSec === option.value ? 'white' : 'primary'"
      //-       //-         @click="form.periodDurationSec = option.value"
      //-       //-         padding="none"
      //-       //-         rounded
      //-       //-         unelevated
      //-       //-         v-for='(option, index) in durationOptions'
      //-       //-       ) {{ option.label }}
      //-       //-     .col-grow
      //-       //-       //isSelected, value
      //-       //-       q-btn.full-width.text-bold(
      //-       //-         border
      //-       //-         color='internal-bg'
      //-       //-         no-caps
      //-       //-         rounded
      //-       //-         text-color='primary'
      //-       //-         unelevated
      //-       //-         v-show="!isCustomPeriodDuration"
      //-       //-       ) Custom period
      //-       //-       div(v-show="isCustomPeriodDuration").bg-primary.text-white.full-width.rounded-border.q-px-sm
      //-       //-         q-input(borderless v-model="form.periodDurationSec" dense bg-color="primary"
      //-       //-         placeholder='Type an amount'
      //-       //-         ).input-amount

      //-   .row.q-mt-xl
      //-     .col-6.q-pr-sm
      //-       label.h-label Unity
      //-       .row.full-width.items-center
      //-         .col-7.row.q-mr-sm
      //-           q-slider(
      //-             :max="100"
      //-             :min="0"
      //-             :step="1"
      //-             color="primary"
      //-             v-model="form.votingAlignmentPercent"
      //-           )
      //-         .col
      //-           q-input.rounded-border.q-py-sm(
      //-             :rules="[val => val >= 0 && val <= 100]"
      //-             dense
      //-             outlined
      //-             rounded
      //-             suffix="%"
      //-             type="number"
      //-             v-model.number="form.votingAlignmentPercent"
      //-           )

      //-     .col-6.q-pl-sm
      //-       label.h-label Quorum
      //-       .row.full-width.items-center
      //-         .col-7.row.q-mr-sm
      //-           q-slider(
      //-             :max="100"
      //-             :min="0"
      //-             :step="1"
      //-             color="primary"
      //-             v-model="form.votingQuorumPercent"
      //-           )
      //-         .col
      //-           q-input.rounded-border.q-py-sm(
      //-             :rules="[val => val >= 0 && val <= 100]"
      //-             dense
      //-             outlined
      //-             rounded
      //-             suffix="%"
      //-             type="number"
      //-             v-model.number="form.votingQuorumPercent"
      //-           )

      //-   //- .row.q-mt-sm
      //-   //-   .col-6.row.q-pr-sm
      //-   //-     .row.items-end.full-width
      //-   //-       .label.full-width Decay Period for Voting
      //-   //-       .q-mt-xs.row.full-width
      //-   //-         .col-7.row.justify-between.q-mr-sm
      //-   //-           q-btn.button.text-bold.text-lowercase(
      //-   //-             :color="form.votingDurationSec === option.value ? 'primary' : 'internal-bg'"
      //-                       :key='index'
      //-   //-             :text-color="form.votingDurationSec === option.value ? 'white' : 'primary'"
      //-   //-             @click="form.votingDurationSec = option.value"
      //-   //-             padding="none"
      //-   //-             rounded
      //-   //-             unelevated
      //-   //-             v-for='(option, index) in durationOptions'
      //-   //-           ) {{ option.label }}
      //-   //-         .col-grow
      //-   //-           q-btn.full-width.text-bold(
      //-   //-             border
      //-   //-             color='internal-bg'
      //-   //-             no-caps
      //-   //-             rounded
      //-   //-             text-color='primary'
      //-   //-             unelevated
      //-   //-           ) Custom period

      //- STEP 6
      //- section.column.full-width.q-mb-xl(v-show="activeStep === 'COMPENSATION'")
      //-   label.h-h4 Compensation
      //-   p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      //-   .row.items-stretch.q-col-gutter-xs.q-my-xl
      //-     .col-4.row.items-center
      //-       q-avatar(size='30px' color='primary')
      //-         img(src="~assets/icons/token-utility-icon.svg")
      //-       div.q-mx-sm
      //-         p.q-pa-none.q-ma-none.font-lato.text-heading.text-xs.text-weight-700 Utility token
      //-         p.q-pa-none.q-ma-none.font-sans.text-xs(:style="{'color':'#84878E'}") Multiplier
      //-       q-input.q-pa-none.q-ma-none.rounded-border.col-5(
      //-           :debounce="200"
      //-           :rules="[rules.required]"
      //-           bg-color="white"
      //-           color="accent"
      //-           dense
      //-           lazy-rules="ondemand"
      //-           maxlength="50"
      //-           outlined
      //-           placeholder="1x"
      //-           ref="utilityTokenMultiplier"
      //-           rounded
      //-           suffix="x"
      //-           v-model="form.utilityTokenMultiplier"
      //-         )
      //-     .col-4.row.items-center
      //-       q-avatar(size='30px' color='primary')
      //-         img(src="~assets/icons/token-voice-icon.svg")
      //-       div.q-mx-sm
      //-         p.q-pa-none.q-ma-none.font-lato.text-heading.text-xs.text-weight-700 Voice token
      //-         p.q-pa-none.q-ma-none.font-sans.text-xs(:style="{'color':'#84878E'}") Multiplier
      //-       q-input.q-pa-none.q-ma-none.rounded-border.col-5(
      //-           :debounce="200"
      //-           :rules="[rules.required]"
      //-           bg-color="white"
      //-           color="accent"
      //-           dense
      //-           lazy-rules="ondemand"
      //-           maxlength="50"
      //-           outlined
      //-           placeholder="1x"
      //-           ref="voiceTokenMultiplier"
      //-           rounded
      //-           suffix="x"
      //-           v-model="form.voiceTokenMultiplier"
      //-         )
      //-     .col-4.row.items-center
      //-       q-avatar(size='30px' color='primary')
      //-         img(src="~assets/icons/token-treasury-icon.svg")
      //-       div.q-mx-sm
      //-         p.q-pa-none.q-ma-none.font-lato.text-heading.text-xs.text-weight-700 Treasury token
      //-         p.q-pa-none.q-ma-none.font-sans.text-xs(:style="{'color':'#84878E'}") Multiplier
      //-       q-input.q-pa-none.q-ma-none.rounded-border.col-5(
      //-           :debounce="200"
      //-           :rules="[rules.required]"
      //-           bg-color="white"
      //-           color="accent"
      //-           dense
      //-           lazy-rules="ondemand"
      //-           maxlength="50"
      //-           outlined
      //-           placeholder="1x"
      //-           ref="treasuryTokenMultiplier"
      //-           rounded
      //-           suffix="x"
      //-           v-model="form.treasuryTokenMultiplier"
      //-         )

      //-   .column.full-width.q-mt-xl
      //-     label.h-h4 Salary bands
      //-     p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      //-   template(v-for="(salary, index) in form.salaries")
      //-     .row.q-col-gutter-xs.q-mt-sm
      //-       .col-6
      //-         label.h-label Name
      //-         q-input.q-mt-xs.q-pa-none.rounded-border(
      //-               :debounce="200"
      //-               :ref="'salaries.' + index + '.name'"
      //-               :rules="[rules.required]"
      //-               bg-color="white"
      //-               color="accent"
      //-               dense
      //-               lazy-rules="ondemand"
      //-               maxlength="50"
      //-               outlined
      //-               rounded
      //-               v-model="salary.name"
      //-             )
      //-       .col-6.row.items-center.q-col-gutter-xs
      //-         .col-3
      //-           label.h-label.text-xs.text-weigth-500 Value
      //-           q-input.q-pa-none.q-mt-xs.rounded-border(
      //-                 :debounce="200"
      //-                 :ref="'salaries.' + index + '.value'"
      //-                 :rules="[rules.required]"
      //-                 bg-color="white"
      //-                 color="accent"
      //-                 dense
      //-                 lazy-rules="ondemand"
      //-                 maxlength="50"
      //-                 outlined
      //-                 rounded
      //-                 suffix="$"
      //-                 v-model="salary.value"
      //-               )

      //-         .col-3
      //-           label.h-label.text-xs.text-weigth-500 Utility token
      //-           q-input.q-pa-none.q-mt-xs.rounded-border(
      //-                 :debounce="200"
      //-                 :disable="true"
      //-                 :value="salary.value * form.utilityTokenMultiplier"
      //-                 :rules="[rules.required]"
      //-                 bg-color="white"
      //-                 color="accent"
      //-                 dense
      //-                 lazy-rules="ondemand"
      //-                 outlined
      //-                 rounded
      //-               )
      //-         .col-3
      //-           label.h-label.text-xs.text-weigth-500 Treasury token
      //-           q-input.q-pa-none.q-mt-xs.rounded-border(
      //-                 :debounce="200"
      //-                 :disable="true"
      //-                 :value="salary.value * form.treasuryTokenMultiplier"
      //-                 :rules="[rules.required]"
      //-                 bg-color="white"
      //-                 color="accent"
      //-                 dense
      //-                 lazy-rules="ondemand"
      //-                 outlined
      //-                 rounded
      //-               )
      //-         .col-3
      //-           label.h-label.text-xs.text-weigth-500 Voice token
      //-           q-input.q-pa-none.q-mt-xs.rounded-border(
      //-                 :debounce="200"
      //-                 :disable="true"
      //-                 :value="salary.value * form.voiceTokenMultiplier"
      //-                 :rules="[rules.required]"
      //-                 bg-color="white"
      //-                 color="accent"
      //-                 dense
      //-                 lazy-rules="ondemand"
      //-                 outlined
      //-                 rounded
      //-               )

      //-     nav.row.full-width.justify-end.q-mt-xs
      //-       q-btn(:disable="index === 0" flat color="primary" no-caps padding="none" @click="form.salaries.splice(index, 1)").text-bold.q-pa-none.q-mr-xs Remove band -
      //-       q-btn(v-show="index === form.salaries.length - 1" flat color="primary" no-caps padding="none" @click="form.salaries.push({name: '', value: 0})").text-bold.q-pa-none.q-ml-lg.q-mr-xs Add more +

      //- STEP 7
      section.column.full-width.q-mb-xl(v-show="activeStep === 'DESIGN'")
        label.h-h4 Design
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md The logo, copy and colours can be changed later in the configuration page.
        .row.items-center.q-col-gutter-xs.q-mt-xl
          .col-4.justify-between
            .row.full-width
              .label.full-width Logo
              .row.full-width.q-my-sm.items-center
                q-btn.full-width.q-px-xl.rounded-border.text-bold(
                  @click="$refs.ipfsInput.chooseFile()"
                  color="primary"
                  no-caps
                  outline
                  rounded
                  unelevated
                ) Upload an image (max 3MB)
                input-file-ipfs(
                  @uploadedFile="onImageUploaded"
                  v-show="false"
                  ref="ipfsInput"
                  image
                )

          .col-4.row
            .label.full-width UI Primary color
            .row.full-width.q-my-sm.items-center
              .col-auto.q-mr-sm
                q-avatar(size="40px" :style="{'background': form.primaryColor}")
              .col
                q-input.rounded-border(
                      :debounce="200"
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
            q-popup-proxy(cover transition-show="scale" transition-hide="scale")
             q-color(v-model="form.primaryColor")

          .col-4.row
            .label.full-width UI Secondary color
            .row.full-width.q-my-sm.items-center
              .col-auto.q-mr-sm
                q-avatar(size="40px" :style="{'background': form.secondaryColor}")
              .col
                q-input.rounded-border(
                      :debounce="200"
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
            q-popup-proxy(cover transition-show="scale" transition-hide="scale")
             q-color(v-model="form.secondaryColor")

        .row.justify-center.items-center.q-col-gutter-xs.q-mt-xl
          ipfs-image-viewer(
              :ipfsCid="form.logo"
              showDefault
              :defaultLabel="form.title"
              size="130px"
            )
          label.h-h4.full-width.text-center {{ form.title }}
        .row.full-width.justify-center.items-center.q-mt-xl
          q-btn.q-px-xl.q-mr-xs(
            :style="{'background': form.primaryColor}"
            label="Primary color"
            no-caps
            rounded
            text-color='white'
            unelevated
          )
          q-btn.q-px-xl.q-ml-xs(
            :style="{'background': form.secondaryColor}"
            label="Secondary color"
            no-caps
            rounded
            text-color='white'
            unelevated
        )

        //- .row.items-stretch.q-col-gutter-xs
        //-   template(v-for="(opts, index) in DESIGN_TEMPLATES")
        //-     .col-3
        //-       button-radio.full-height(
        //-         :hideIcon="true"
        //-         :selected="form.design === opts.key"
        //-         :title="opts.title"
        //-         :description="opts.description"
        //-         :disable="opts.disable"
        //-         @click="form.design = opts.key"
        //-       )
        //-         .q-mt-md
        //-           q-avatar(:style="{'background': opts.primaryColor}"   size='32px').bubbles
        //-             span(v-show="opts.primaryColor === 'white'") ?
        //-           q-avatar(:style="{'background': opts.secondaryColor}" size='32px').bubbles
        //-             span(v-show="opts.primaryColor === 'white'") ?
        //-           q-avatar(size='30px' color="white").bubbles
        //-             img(v-show="opts.headerPattern !== ''" :src="opts.headerPattern")
        //-             span(v-show="opts.primaryColor === 'white'") ?

        //- .row.full-width.q-mt-md(v-show="form.design==='CUSTOM'")

      //- ERROR MESSAGES
      div.row.full-width
        .text-red.bg-white(v-if="error") {{ error }}

      //- NAVIGATION
      nav.row.justify-end.q-mt-xl.q-gutter-xs
        q-btn.q-px-xl(
          :disable="submitting"
          @click="onPrevStep"
          color="primary"
          label="Back"
          no-caps
          outline
          rounded
          unelevated
          v-show="activeStepIndex > 0"
        )
        q-btn.q-px-xl(
          :disable="submitting"
          :loading="submitting"
          @click="onNextStep"
          color="primary"
          :label="lastStep ? 'Publish' : 'Next step'"
          no-caps
          rounded
          unelevated
        )

  .column.col-xs-12.col-sm-3.col-md-3
    creation-stepper(
      :activeStepIndex="activeStepIndex"
      :steps="steps"
    )
</template>

<style lang="stylus" scoped>

.bubbles
  margin-left: -8px;
  border: 2px solid white;

.subtitle
  font-family: Lato, sans-serif !important
  font-size: 13px !important
  color: #84878E !important
  line-height:26px

.button
  font-size: 13px;
  width: 40px
  height: 40px;

.rounded-border
  border-radius 15px

.rounded-border
  :first-child
    border-radius 15px
</style>
