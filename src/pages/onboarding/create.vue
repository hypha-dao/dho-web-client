<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
import pick from '~/utils/pick'

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
        { value: '1.0', label: '1,0' },
        { value: '1.00', label: '1,00' },
        { value: '1.000', label: '1,000' },
        { value: '1.0000', label: '1,0000' }
      ]
    }
  }
}

export default {
  name: 'dho-creation',
  mixins: [validation, options, duration],
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    CustomPeriodInput: () =>
      import('~/components/form/custom-period-input.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      activeStepIndex: 0,
      steps: [
        'GENERAL_INFO',
        'TOKEN',
        'LAUNCH_TEAM',
        'VOTING',
        'COMPENSATION',
        'TEMPLATES',
        'DESIGN'
      ],

      error: null,
      loading: false,
      submitting: false,

      form: {
        // # STEP 1
        name: null, // eosio "name" convention
        title: null, // free form
        description: null,

        // # STEP 2
        template: null, // i.e docId of the dao

        // # STEP 3
        reward_token: null, // Utility token
        utilitySymbol: null,
        utilityDigits: null,
        utilityAmount: null, // i.e 100000 or -1 for infinite supply
        utilityValue: null,
        voice_token: null, // Voice token
        voiceSymbol: null,
        voiceDigits: null,
        peg_token: null, // Treasury token
        treasurySymbol: null,
        treasuryDigits: null,
        use_seeds: false,

        // # STEP 4
        members: [{ account: '', email: '' }],

        // # STEP 5
        votingDurationSec: 604800, // 1 week
        periodDurationSec: 0,
        votingAlignmentPercent: 80,
        votingQuorumPercent: 20,

        // # STEP 6
        utilityTokenMultiplier: 1,
        voiceTokenMultiplier: 1,
        treasuryTokenMultiplier: 1,

        salaries: [{ name: 'Band 1', value: 0 }],

        // # STEP 7
        design: null,

        logo: null,
        primaryColor: null,
        secondaryColor: null,
        headerPattern: null,
        patternColor: null,

        homepageHeader: null,
        homepageSubtitle: null,
        proposalsHeader: null,
        proposalsSubtitle: null,
        membersHeader: null,
        membersSubtitle: null,
        organizationHeader: null,
        organizationSubtitle: null
      }
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('profiles', ['isConnected']),

    lastStep () {
      return this.activeStepIndex === this.steps.length - 1
    }
  },

  watch: {},

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
      // if (!(await this.isNextAvailable())) {
      //   return
      // }

      await this.createDAO({
        data: { ...this.form, onboarder_account: this.account }
      })

      if (this.lastStep) {
        try {
          this.submitting = true
          await this.createDAO({ data: { ...this.form } })
          // this.$router.push({ name: 'profile', params: { username: this.account } })
        } catch (error) {
          this.error = error
        }
      } else {
        this.activeStepIndex = this.activeStepIndex + 1
      }

      this.submitting = false
    },

    async isNextAvailable () {
      const dataForValidation = {
        0: { ...pick(this.form, ['name', 'description']) },
        // 1: { ...pick(this.form, ['template']) },
        2: {
          ...pick(this.form, [
            'utilitySymbol',
            'utilityDigits',
            'utilityAmount',
            'utilityValue',
            'voiceSymbol',
            'voiceDigits',
            'treasurySymbol',
            'treasuryDigits'
          ])
        }
        // 3: { ...pick(this.form, ['email', 'phoneNumber', 'contactMethod']) }
      }

      const valid = await this.validateForm(
        dataForValidation[this.activeStepIndex]
      )

      return valid
    },

    async validateForm (form) {
      await this.resetValidation(form)
      return await this.validate(form)
    },

    getImgUrl (pic) {
      console.log(pic)
      return require(pic)
    },

    async onReadFile (e) {
      const [file] = e.target.files
      const self = this

      try {
        const preview = new FileReader()
        preview.onload = function () { self.form.logo = preview.result }
        preview.readAsDataURL(file)

        // const reader = new FileReader()
        // reader.onload = function (e) { self.form.avatarFile = new Blob([reader.result]) }
        // reader.readAsArrayBuffer(file)
      } catch (error) {

      }
    }
  },

  updated () {
    // console.log('FORM::', JSON.stringify(this.form))
  }
}
</script>

<template lang="pug">
.row.justify-between
  .column.col-xs-12.col-sm-9.col-md-9.q-pr-md
    widget
      //- STEP 1
      section.row(v-show="activeStepIndex === 0")
        label.h-h4 General info
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
        .row.full-width.justify-between.q-mt-sm
          .col-12
            label.h-label Name
            q-input.q-mt-xs.rounded-border(
              :rules="[rules.required]"
              dense
              lazy-rules="ondemand"
              maxlength="50"
              outlined
              placeholder="Type your name here"
              ref="name"
              v-model="form.name"
            )
          .col-12
            label.h-label Description
            q-input.q-mt-xs.rounded-border(
              :input-style="{ 'resize': 'none' }"
              :rules="[rules.required]"
              dense
              lazy-rules="ondemand"
              outlined
              placeholder="Type a description here"
              ref="description"
              rows='10'
              type="textarea"
              v-model="form.description"
            )

      //- STEP 2
      section.column.full-width(v-show="activeStepIndex === 1")
        .row
          q-avatar(size='30px').q-mr-xs
            img(src="~assets/icons/token-utility-icon.svg")
          label.h-h4 Utility token
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        .row.full-width.justify-between.q-mt-sm
          .col-8.q-pr-xs
            label.h-label Symbol
            q-input.q-mt-xs.rounded-border(
                  :debounce="200"
                  :rules="[rules.required]"
                  bg-color="white"
                  color="accent"
                  dense
                  lazy-rules
                  mask="AAAAAAAA"
                  maxlength="7"
                  outlined
                  placeholder="Max 7 characters uppercase A-Z"
                  ref="utilitySymbol"
                  rounded
                  v-model="form.utilitySymbol"
                )
          .col-4
            label.h-label Number of Digits
            q-select.q-mt-xs.rounded-border(
                :options="numberOfDigits"
                :rules="[rules.required]"
                bg-color="white"
                dense
                emit-value,
                fill-input
                hide-selected
                map-options
                option-label="label"
                option-value="value"
                outlined
                placeholder=""
                ref="utilityDigits"
                rounded
                use-input
                v-model='form.utilityDigits'
              )

        .row.full-width.justify-between
          .col-6.q-pr-xs
            label.h-label Total amount
            q-input.q-mt-xs.rounded-border(
                  :debounce="200"
                  :rules="[rules.required]"
                  bg-color="white"
                  color="accent"
                  dense
                  lazy-rules
                  outlined
                  placeholder=""
                  ref="utilityAmount"
                  rounded
                  type='number'
                  v-model="form.utilityAmount"
                )
          .col-6
            label.h-label Value
            q-input.q-mt-xs.rounded-border(
                  :debounce="200"
                  :rules="[rules.required]"
                  bg-color="white"
                  color="accent"
                  dense
                  lazy-rules
                  outlined
                  placeholder=""
                  ref="utilityValue"
                  rounded
                  type='number'
                  v-model="form.utilityValue"
                )

        .row.q-mt-xl
          .row
            q-avatar(size='30px').q-mr-xs
              img(src="~assets/icons/token-voice-icon.svg")
            label.h-h4 Voice token
          p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          .row.full-width.justify-between.q-mt-sm
            .col-8.q-pr-xs
              label.h-label Symbol
              q-input.q-mt-xs.rounded-border(
                    :debounce="200"
                    :rules="[rules.required]"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules
                    mask="AAAAAAAA"
                    maxlength="7"
                    outlined
                    placeholder="Max 7 characters uppercase A-Z"
                    ref="voiceSymbol"
                    rounded
                    v-model="form.voiceSymbol"
                  )
            .col-4
              label.h-label Number of Digits
              q-select.q-mt-xs.rounded-border(
                  :options="numberOfDigits"
                  :rules="[rules.required]"
                  bg-color="white"
                  dense
                  emit-value,
                  fill-input
                  hide-selected
                  map-options
                  option-label="label"
                  option-value="value"
                  outlined
                  placeholder=""
                  ref="voiceDigits"
                  rounded
                  use-input
                  v-model='form.voiceDigits'
                )

        .row.q-mt-xl
          .row
            q-avatar(size='30px').q-mr-xs
              img(src="~assets/icons/token-treasury-icon.svg")
            label.h-h4 Treasury token
          p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          .row.full-width.justify-between.q-mt-sm
            .col-8.q-pr-xs
              label.h-label Symbol
              q-input.q-mt-xs.rounded-border(
                    :debounce="200"
                    :rules="[rules.required]"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules
                    mask="AAAAAAAA"
                    maxlength="7"
                    outlined
                    placeholder="Max 7 characters uppercase A-Z"
                    ref="treasurySymbol"
                    rounded
                    v-model="form.treasurySymbol"
                  )
            .col-4
              label.h-label Number of Digits
              q-select.q-mt-xs.rounded-border(
                  :options="numberOfDigits"
                  :rules="[rules.required]"
                  bg-color="white"
                  dense
                  emit-value,
                  fill-input
                  hide-selected
                  map-options
                  option-label="label"
                  option-value="value"
                  outlined
                  placeholder=""
                  ref="treasuryDigits"
                  rounded
                  use-input
                  v-model='form.treasuryDigits'
                )

        .row.q-mt-xl
          label.h-h4 Additional token
          p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          .row.full-width.justify-between.q-mt-sm
            .row.full-width
              .row.col
                q-avatar(size="30px")
                  img(:src="require('~/assets/icons/seeds.png')")
                div.q-mx-sm.col
                  p.q-pa-none.q-ma-none.font-lato.text-heading.text-xs.text-weight-700 Seeds
                  p.q-pa-none.q-ma-none.font-sans.text-xs(:style="{'color':'#84878E'}") Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              div
                q-toggle(v-model="form.use_seeds")

      //- STEP 3
      section.column.full-width.q-mb-xl(v-show="activeStepIndex === 2")
        label.h-h4 Launch team
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        template(v-for="(member, index) in form.members")
          .row.full-width.justify-between
            .col-6.q-pr-xs
              label.h-label Account name
              q-input.q-mt-xs.q-pa-none.rounded-border(
                    :debounce="200"
                    :rules="[rules.required]"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules
                    maxlength="50"
                    outlined
                    placeholder="Type account name here"
                    rounded
                    v-model="member.account"
                  )
            .col-6
              label.h-label Email
              q-input.q-mt-xs.q-pa-none.rounded-border(
                    :debounce="200"
                    :rules="[rules.required]"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules
                    maxlength="50"
                    outlined
                    placeholder="Type email here"
                    rounded
                    v-model="member.email"
                  )
            nav.row.full-width.justify-end.q-mt-xs
              q-btn(:disable="index === 0" flat color="primary" no-caps padding="none" @click="form.members.splice(index, 1)").text-bold.q-pa-none.q-mr-xs Remove account -
              q-btn(:disable="form.members.length === 10" v-show="index === form.members.length - 1" flat color="primary" no-caps padding="none" @click="form.members.push({account:'',email:''})").text-bold.q-pa-none.q-ml-lg.q-mr-xs Add more +

      //- STEP 4
      section.column.full-width.q-mb-xl(v-show="activeStepIndex === 3")
        label.h-h4 Voting
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        .row.q-my-xl.full-width
          .col-8.row.q-pr-sm
            .row.items-end.full-width
              label.h-label.full-width Vote duration
              .q-mt-xs.row.full-width
                .col-7.row.justify-between.q-mr-sm
                  q-btn.button.text-bold.text-lowercase(
                    :color="form.votingDurationSec === option.value ? 'primary' : 'internal-bg'"
                    :key='index'
                    :text-color="form.votingDurationSec === option.value ? 'white' : 'primary'"
                    @click="form.votingDurationSec = option.value"
                    padding="none"
                    rounded
                    unelevated
                    v-for='(option, index) in durationOptions'
                  ) {{ option.label }}
                .col-grow
                  custom-period-input(:isActive="isCustomVotingDuration" @selected="form.votingDurationSec = 0" v-model='form.votingDurationSec')

          .col-8.row.q-pr-sm.q-mt-xl
            .row.items-end.full-width
              label.h-label.full-width Period duration
              .q-mt-xs.row.full-width
                .col-7.row.justify-between.q-mr-sm
                  q-btn.button.text-bold.text-lowercase(
                    :color="form.periodDurationSec === option.value ? 'primary' : 'internal-bg'"
                    :key='index'
                    :text-color="form.periodDurationSec === option.value ? 'white' : 'primary'"
                    @click="form.periodDurationSec = option.value"
                    padding="none"
                    rounded
                    unelevated
                    v-for='(option, index) in durationOptions'
                  ) {{ option.label }}
                .col-grow
                  custom-period-input(:isActive="isCustomVotingDuration" @selected="form.periodDurationSec = 0" v-model='form.periodDurationSec')

          .col-6.row.q-pl-sm
            //- .row.items-end.full-width
            //-   label.h-label.full-width Period duration
            //-   .q-mt-xs.row.full-width
            //-     .col-7.row.justify-between.q-mr-sm
            //-       q-btn.button.text-bold.text-lowercase(
            //-         :color="form.periodDurationSec === option.value ? 'primary' : 'internal-bg'"
                                :key='index'
            //-         :text-color="form.periodDurationSec === option.value ? 'white' : 'primary'"
            //-         @click="form.periodDurationSec = option.value"
            //-         padding="none"
            //-         rounded
            //-         unelevated
            //-         v-for='(option, index) in durationOptions'
            //-       ) {{ option.label }}
            //-     .col-grow
            //-       //isSelected, value
            //-       q-btn.full-width.text-bold(
            //-         border
            //-         color='internal-bg'
            //-         no-caps
            //-         rounded
            //-         text-color='primary'
            //-         unelevated
            //-         v-show="!isCustomPeriodDuration"
            //-       ) Custom period
            //-       div(v-show="isCustomPeriodDuration").bg-primary.text-white.full-width.rounded-border.q-px-sm
            //-         q-input(borderless v-model="form.periodDurationSec" dense bg-color="primary"
            //-         placeholder='Type an amount'
            //-         ).input-amount

        .row.q-mt-xl
          .col-6.q-pr-sm
            label.h-label Unity
            .row.full-width.items-center
              .col-7.row.q-mr-sm
                q-slider(
                  :max="100"
                  :min="0"
                  :step="1"
                  color="primary"
                  v-model="form.votingAlignmentPercent"
                )
              .col
                q-input.rounded-border.q-py-sm(
                  :rules="[val => val >= 0 && val <= 100]"
                  dense
                  outlined
                  rounded
                  suffix="%"
                  type="number"
                  v-model.number="form.votingAlignmentPercent"
                )

          .col-6.q-pl-sm
            label.h-label Quorum
            .row.full-width.items-center
              .col-7.row.q-mr-sm
                q-slider(
                  :max="100"
                  :min="0"
                  :step="1"
                  color="primary"
                  v-model="form.votingQuorumPercent"
                )
              .col
                q-input.rounded-border.q-py-sm(
                  :rules="[val => val >= 0 && val <= 100]"
                  dense
                  outlined
                  rounded
                  suffix="%"
                  type="number"
                  v-model.number="form.votingQuorumPercent"
                )

        //- .row.q-mt-sm
        //-   .col-6.row.q-pr-sm
        //-     .row.items-end.full-width
        //-       .label.full-width Decay Period for Voting
        //-       .q-mt-xs.row.full-width
        //-         .col-7.row.justify-between.q-mr-sm
        //-           q-btn.button.text-bold.text-lowercase(
        //-             :color="form.votingDurationSec === option.value ? 'primary' : 'internal-bg'"
                            :key='index'
        //-             :text-color="form.votingDurationSec === option.value ? 'white' : 'primary'"
        //-             @click="form.votingDurationSec = option.value"
        //-             padding="none"
        //-             rounded
        //-             unelevated
        //-             v-for='(option, index) in durationOptions'
        //-           ) {{ option.label }}
        //-         .col-grow
        //-           q-btn.full-width.text-bold(
        //-             border
        //-             color='internal-bg'
        //-             no-caps
        //-             rounded
        //-             text-color='primary'
        //-             unelevated
        //-           ) Custom period

      //- STEP 5
      section.column.full-width.q-mb-xl(v-show="activeStepIndex === 4")
        label.h-h4 Compensation
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        .row.items-stretch.q-col-gutter-xs.q-my-xl
          .col-4.row.items-center
            q-avatar(size='30px' color='primary')
              img(src="~assets/icons/token-utility-icon.svg")
            div.q-mx-sm
              p.q-pa-none.q-ma-none.font-lato.text-heading.text-xs.text-weight-700 Utility token
              p.q-pa-none.q-ma-none.font-sans.text-xs(:style="{'color':'#84878E'}") Multiplier
            q-input.q-pa-none.q-ma-none.rounded-border.col-5(
                :debounce="200"
                :rules="[rules.required]"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="50"
                outlined
                placeholder="1x"
                ref="utilityTokenMultiplier"
                rounded
                suffix="x"
                v-model="form.utilityTokenMultiplier"
              )
          .col-4.row.items-center
            q-avatar(size='30px' color='primary')
              img(src="~assets/icons/token-voice-icon.svg")
            div.q-mx-sm
              p.q-pa-none.q-ma-none.font-lato.text-heading.text-xs.text-weight-700 Voice token
              p.q-pa-none.q-ma-none.font-sans.text-xs(:style="{'color':'#84878E'}") Multiplier
            q-input.q-pa-none.q-ma-none.rounded-border.col-5(
                :debounce="200"
                :rules="[rules.required]"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="50"
                outlined
                placeholder="1x"
                ref="voiceTokenMultiplier"
                rounded
                suffix="x"
                v-model="form.voiceTokenMultiplier"
              )
          .col-4.row.items-center
            q-avatar(size='30px' color='primary')
              img(src="~assets/icons/token-treasury-icon.svg")
            div.q-mx-sm
              p.q-pa-none.q-ma-none.font-lato.text-heading.text-xs.text-weight-700 Treasury token
              p.q-pa-none.q-ma-none.font-sans.text-xs(:style="{'color':'#84878E'}") Multiplier
            q-input.q-pa-none.q-ma-none.rounded-border.col-5(
                :debounce="200"
                :rules="[rules.required]"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="50"
                outlined
                placeholder="1x"
                ref="treasuryTokenMultiplier"
                rounded
                suffix="x"
                v-model="form.treasuryTokenMultiplier"
              )

        .column.full-width.q-mt-xl
          label.h-h4 Salary bands
          p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        template(v-for="(salary, index) in form.salaries")
          .row.q-col-gutter-xs.q-mt-sm
            .col-6
              label.h-label Name
              q-input.q-mt-xs.q-pa-none.rounded-border(
                    :debounce="200"
                    :rules="[rules.required]"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules
                    maxlength="50"
                    outlined
                    ref="salary.name"
                    rounded
                    v-model="salary.name"
                  )
            .col-6.row.items-center.q-col-gutter-xs
              .col-3
                label.h-label.text-xs.text-weigth-500 Value
                q-input.q-pa-none.q-mt-xs.rounded-border(
                      :debounce="200"
                      :rules="[rules.required]"
                      bg-color="white"
                      color="accent"
                      dense
                      lazy-rules
                      maxlength="50"
                      outlined
                      ref="salary.value"
                      rounded
                      v-model="salary.value"
                      suffix="$"
                    )

              .col-3
                label.h-label.text-xs.text-weigth-500 Utility token
                q-input.q-pa-none.q-mt-xs.rounded-border(
                      :debounce="200"
                      :disable="true"
                      :value="salary.value * form.utilityTokenMultiplier"
                      :rules="[rules.required]"
                      bg-color="white"
                      color="accent"
                      dense
                      lazy-rules
                      outlined
                      rounded
                    )
              .col-3
                label.h-label.text-xs.text-weigth-500 Treasury token
                q-input.q-pa-none.q-mt-xs.rounded-border(
                      :debounce="200"
                      :disable="true"
                      :value="salary.value * form.treasuryTokenMultiplier"
                      :rules="[rules.required]"
                      bg-color="white"
                      color="accent"
                      dense
                      lazy-rules
                      outlined
                      rounded
                    )
              .col-3
                label.h-label.text-xs.text-weigth-500 Voice token
                q-input.q-pa-none.q-mt-xs.rounded-border(
                      :debounce="200"
                      :disable="true"
                      :value="salary.value * form.voiceTokenMultiplier"
                      :rules="[rules.required]"
                      bg-color="white"
                      color="accent"
                      dense
                      lazy-rules
                      outlined
                      rounded
                    )

          nav.row.full-width.justify-end.q-mt-xs
            q-btn(:disable="index === 0" flat color="primary" no-caps padding="none" @click="form.salaries.splice(index, 1)").text-bold.q-pa-none.q-mr-xs Remove band -
            q-btn(v-show="index === form.salaries.length - 1" flat color="primary" no-caps padding="none" @click="form.salaries.push({name: '', value: 0})").text-bold.q-pa-none.q-ml-lg.q-mr-xs Add more +

      //- STEP 6
      section.row(v-show="activeStepIndex === 5")
        label.h-h4 Templates
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        .row.items-stretch.q-col-gutter-xs.q-mt-md
          template(v-for="opts in ORGANISATION_TEMPLATES")
            .col-4
              button-radio.full-height(
                :icon="opts.icon"
                :selected="opts.key === form.template"
                :title="opts.title"
                :description="opts.description"
                :disable="opts.disable"
                @click="form.template = opts.key"
              )
                div.full-width.text-left.q-mt-lg
                  p.font-sans.text-weight-700.text-xs Role Archetypes (3)
                  p.font-sans.text-weight-700.text-xs Salary Bands (7)
                  p.font-sans.text-weight-700.text-xs Badges (5)
                  p.font-sans.text-weight-700.text-xs Policies (9)
                  p.font-sans.text-weight-700.text-xs Treasury (3)

                div.full-width.row.justify-between
                  q-btn.col-6(
                    :color="opts.key === form.template ? 'white' :'primary'"
                    :disable="submitting"
                    :label="opts.key === form.template ? 'Selected' :'Select'"
                    :loading="submitting"
                    :text-color="opts.key === form.template ? 'primary' :'white'"
                    @click="form.template = opts.key"
                    no-caps
                    rounded
                    unelevated
                  )
                  q-btn.col-6(
                    :disable="submitting"
                    @click="form.template = opts.key"
                    color="primary"
                    label="Learn more"
                    no-caps
                    flat
                    rounded
                    unelevated
                    v-show="activeStepIndex > 0"
                  )

      //- STEP 7
      section.row(v-show="activeStepIndex === 6")
        label.h-h4 Design
        p.font-sans.text-xs.text-weight-500.text-h-gray.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        .row.items-stretch.q-col-gutter-xs
          template(v-for="(opts, index) in DESIGN_TEMPLATES")
            .col-3
              button-radio.full-height(
                :hideIcon="true"
                :selected="form.design === opts.key"
                :title="opts.title"
                :description="opts.description"
                :disable="opts.disable"
                @click="form.design = opts.key"
              )
                .q-mt-md
                  q-avatar(:style="{'background': opts.primaryColor}"   size='32px').bubbles
                    span(v-show="opts.primaryColor === 'white'") ?
                  q-avatar(:style="{'background': opts.secondaryColor}" size='32px').bubbles
                    span(v-show="opts.primaryColor === 'white'") ?
                  q-avatar(size='30px' color="white").bubbles
                    img(v-show="opts.headerPattern !== ''" :src="opts.headerPattern")
                    span(v-show="opts.primaryColor === 'white'") ?

        .row.full-width.q-mt-md(v-show="form.design==='CUSTOM'")

      div.row.full-width
        .text-red.bg-white(v-if="error") {{ error }}

      nav.row.justify-end.q-mt-xl.q-gutter-xs
        q-btn.q-px-xl(
          :disable="submitting"
          @click="onPrevStep"
          color="primary"
          label="Previous step"
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
          label="Next step"
          no-caps
          rounded
          unelevated
        )

  .column.col-xs-12.col-sm-3.col-md-3
    widget
      .h-h4.q-my-md Creation process
      q-list().q-pt-md.wizard
        template(v-for="(step, index) in steps")
          q-item(:key="index" ).q-py-md.q-px-none.wizard-item
            q-item-section(avatar)
              transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
                span(v-show='activeStepIndex > index').wizard-item-line
              div(:class="activeStepIndex === index && 'active'").text-bold.wizard-item-icon
                span(v-show='activeStepIndex <= index') {{ index + 1 }}
                q-icon(v-show='activeStepIndex > index' center size='10px' name="fas fa-check")
            q-item-section
              div(:class="activeStepIndex === index && 'text-bold text-primary'").q-pl-sm.wizard-item-text {{ capitalizeFirstLetter(step) }}
      //- q-btn.full-width.q-mt-xl.q-mb-md(
      //-     label="Done"
      //-     color="primary"
      //-     unelevated
      //-     rounded
      //-     no-caps
      //-     @click="onNextStep"
      //-     :disable="!lastStep"
      //-   )
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

.wizard-item
  position: relative;
  z-index: 10;

.wizard-item-line
  height: 99%;
  border: 1px solid #242f5d;
  position: absolute;
  top: 1em;
  margin-top: .5em;
  z-index: 1;
  margin-left: 13px;

.wizard-item-icon
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  z-index: 1000;
  background-color: white;
  color: var(--q-color-primary);
  border: 1px solid var(--q-color-primary) !important;

.wizard-item-icon.active
  background-color: white;
  background-color: var(--q-color-primary) ;
  color: white;

.wizard-item-text
  font-size: 15px;
</style>
