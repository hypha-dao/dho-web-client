<script>
import { mapActions, mapGetters } from 'vuex'
import BrowserIpfs from '~/ipfs/browser-ipfs.js'

const defaultSettings = {
  // GENERAL FORM
  votingDurationSec: '',
  periodDurationSec: '',
  votingAlignmentPercent: '',
  votingQuorumPercent: '',

  // decayDurationSec:'',

  // DESIGN FORM
  logo: '',
  primaryColor: '#242f5d',
  secondaryColor: '#3F64EE',
  headerPattern: '',
  patternColor: '#3E3B46',

  homepageHeader: '',
  homepageSubtitle: '',
  proposalsHeader: '',
  proposalsSubtitle: '',
  membersHeader: '',
  membersSubtitle: '',
  organizationHeader: '',
  organizationSubtitle: ''
}

export default {
  name: 'page-configuration',

  components: {
    CustomPeriodInput: () => import('~/components/form/custom-period-input.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {

      form: { ...defaultSettings },
      initialForm: { ...defaultSettings },

      //
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
    ...mapActions('dao', ['updateSettings']),

    async onReadFile (e) {
      const cid = await BrowserIpfs.store(e)
      this.form.logo = cid.replace(/:.*$/, '')
    },

    isCustomDuration (duration) {
      return !this.durationOptions.map(_ => _.value).includes(duration)
    },

    initForm () {
      this.initialForm = {
        // ...this.daoSettings
        votingDurationSec: this.daoSettings.votingDurationSec,
        periodDurationSec: this.daoSettings.periodDurationSec,
        votingAlignmentPercent: this.daoSettings.votingAlignmentPercent,
        votingQuorumPercent: this.daoSettings.votingQuorumPercent,

        logo: this.daoSettings.logo,
        primaryColor: this.daoSettings.primaryColor,
        secondaryColor: this.daoSettings.secondaryColor,
        headerPattern: this.daoSettings.headerPattern,
        patternColor: this.daoSettings.patternColor,

        homepageHeader: this.daoSettings.homepageHeader,
        homepageSubtitle: this.daoSettings.homepageSubtitle,
        proposalsHeader: this.daoSettings.proposalsHeader,
        proposalsSubtitle: this.daoSettings.proposalsSubtitle,
        membersHeader: this.daoSettings.membersHeader,
        membersSubtitle: this.daoSettings.membersSubtitle,
        organizationHeader: this.daoSettings.organizationHeader,
        organizationSubtitle: this.daoSettings.organizationSubtitle
      }

      this.form = { ...this.initialForm }
    },

    onReset () {
      this.form = { ...this.initialForm }
    },

    async onSave () {
      const docId = this.selectedDao.docId

      const data = {
        votingDurationSec: this.form.votingDurationSec,
        periodDurationSec: this.form.periodDurationSec,
        votingAlignment_x100: this.form.votingAlignmentPercent,
        votingQuorum_x100: this.form.votingQuorumPercent,

        logo: this.form.logo,
        primaryColor: this.form.primaryColor,
        secondaryColor: this.form.secondaryColor,
        headerPattern: this.form.headerPattern,
        patternColor: this.form.patternColor,

        homepageHeader: this.form.homepageHeader,
        homepageSubtitle: this.form.homepageSubtitle,
        proposalsHeader: this.form.proposalsHeader,
        proposalsSubtitle: this.form.proposalsSubtitle,
        membersHeader: this.form.membersHeader,
        membersSubtitle: this.form.membersSubtitle,
        organizationHeader: this.form.organizationHeader,
        organizationSubtitle: this.form.organizationSubtitle
      }

      try {
        await this.updateSettings({ docId, data })
        this.initialForm = { ...this.form }
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
      }
    }

  },

  computed: {
    ...mapGetters('accounts', ['account', 'isAdmin']),
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),

    isCustomPeriodDuration () { return this.isCustomDuration(this.form.periodDurationSec) },

    isCustomVotingDuration () { return this.isCustomDuration(this.form.votingDurationSec) },

    hasChanged () { return Object.keys(this.form).some(field => this.form[field] !== this.initialForm[field]) },

    numberOfChanges () { return Object.keys(this.form).filter(field => this.form[field] !== this.initialForm[field]).length }
  },

  mounted () {
    this.initForm()
  },

  watch: {
    daoSettings: {
      handler () {
        this.initForm()
      }
    }
  }

}
</script>

<template lang="pug">
.page-configuration
  .full-width
    widget(title='General' :titleImage='require("~/assets/icons/general-config-icon.svg")' :bar='true').q-pa-none
      p.q-mt-md.subtitle Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

      .row
        .col-6.row.q-pr-sm
          .row.items-end.full-width
            .label.full-width Vote duration
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

        .col-6.row.q-pl-sm
          //- .row.items-end.full-width
          //-   .label.full-width Period duration
          //-   .q-mt-xs.row.full-width
          //-     .col-7.row.justify-between.q-mr-sm
          //-       q-btn.button.text-bold.text-lowercase(
          //-         :color="form.periodDurationSec === option.value ? 'primary' : 'internal-bg'"
          //-         :key='index'
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
          .label Vote alignment (Unity)
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

        .col-6.q-pl-sm
          .label Vote quorum
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

      //- .row.q-mt-sm
      //-   .col-6.row.q-pr-sm
      //-     .row.items-end.full-width
      //-       .label.full-width Decay Period for Voting
      //-       .q-mt-xs.row.full-width
      //-         .col-7.row.justify-between.q-mr-sm
      //-           q-btn.button.text-bold.text-lowercase(
      //-             :color="form.votingDurationSec === option.value ? 'primary' : 'internal-bg'"
      //-             :key='index'
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

  .full-width.q-mt-md
    widget(title='Design' :titleImage='require("~/assets/icons/general-design-icon.svg")' :bar='true').q-pa-none
      p.q-mt-md.subtitle Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

      .row.full-width.justify-between.q-mt-xl
        .col-3.row.justify-between.q-pr-sm
          .row.full-width
            .label.full-width Logo
            .row.full-width.q-my-sm.items-center
              .col-auto.q-mr-sm.text-uppercase
                q-avatar(size="40px" font-size="24px" color="primary" text-color="white")
                  span(v-show="!form.logo") {{ this.selectedDao.name.slice(0,1) }}
                  img(v-show="form.logo" :src="`https://gateway.ipfs.io/ipfs/${form.logo}`")
              .col
                q-file(type="file" ref="file" style="display: none" @input="onReadFile")
                q-btn.full-width.q-px-xl.rounded-border.text-bold(
                  :disable="!isAdmin"
                  @click="$refs.file.pickFiles()"
                  color="primary"
                  no-caps
                  outline
                  rounded
                  unelevated
            ) Upload an image

          .row.full-width.q-mt-sm
            .label.full-width UI Primary color
            .row.full-width.q-my-sm.items-center
              .col-auto.q-mr-sm
                q-avatar(size="40px" :style="{'background': form.primaryColor}")
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
            q-popup-proxy(cover transition-show="scale" transition-hide="scale")
             q-color(v-model="form.primaryColor")

          .row.full-width.q-mt-sm
            .label.full-width UI Secondary color
            .row.full-width.q-my-sm.items-center
              .col-auto.q-mr-sm
                q-avatar(size="40px" :style="{'background': form.secondaryColor}")
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
            q-popup-proxy(cover transition-show="scale" transition-hide="scale")
             q-color(v-model="form.secondaryColor")

          .full-width.q-mt-sm
            .label.full-width Header pattern
            .row.full-width.q-my-sm.items-center.justify-between
              q-avatar(size="40px" :style="{'background': '#3F64EE'}")
              q-avatar(size="40px" :style="{'background': '#3F64EE'}")
              q-avatar(size="40px" :style="{'background': '#3F64EE'}")
              q-avatar(size="40px" :style="{'background': '#3F64EE'}")
              q-avatar(size="40px" :style="{'background': '#3F64EE'}")
              q-avatar(size="40px" :style="{'background': '#3F64EE'}")

          .row.full-width.q-mt-sm
            .label.full-width Pattern color
            .row.full-width.q-my-sm.items-center
              .col-auto.q-mr-sm
                q-avatar(size="40px" :style="{'background': form.patternColor}")
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
            q-popup-proxy(cover transition-show="scale" transition-hide="scale")
             q-color(v-model="form.patternColor")

        .col-9.q-pl-sm.justify-between
          .label.full-width Preview
          .row.full-width.q-my-sm
            svg(xmlns='http://www.w3.org/2000/svg' width='888' height='462' viewbox='0 0 888 462')
              g#Group_2772(data-name='Group 2772' transform='translate(-537 -817)')
                g#Rectangle_184(data-name='Rectangle 184' transform='translate(537 817)' fill='#fff' stroke='#cbcdd1' stroke-width='1')
                  rect(width='888' height='462' rx='20' stroke='none')
                  rect(x='0.5' y='0.5' width='887' height='461' rx='19.5' fill='none')
                rect#Rectangle_662(data-name='Rectangle 662' width='698' height='440' rx='25' transform='translate(579 828)' fill='#f1f1f3')
                g#Group_2737(data-name='Group 2737' transform='translate(630 868.244)')
                  rect#Rectangle_661(data-name='Rectangle 661' width='585' height='137.755' rx='25' :fill='form.primaryColor')
                  g#Group_1416(data-name='Group 1416' transform='translate(18 96.016)')
                    rect#Rectangle_185(data-name='Rectangle 185' width='67.755' height='17.83' rx='8.915' transform='translate(0)' :fill='form.secondaryColor')
                  g#Group_2485(data-name='Group 2485' transform='translate(18 24.154)')
                    rect#Rectangle_185-2(data-name='Rectangle 185' width='154.758' height='17.83' rx='8.915' transform='translate(0)' fill='#fff')
                  g#Group_2481(data-name='Group 2481' transform='translate(18 56.627)')
                    rect#Rectangle_185-3(data-name='Rectangle 185' width='154.758' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                  g#Group_2482(data-name='Group 2482' transform='translate(18 69.221)')
                    rect#Rectangle_185-4(data-name='Rectangle 185' width='117.477' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2739(data-name='Group 2739' transform='translate(1295 841.367)')
                  circle#photo-1586297098710-0382a496c814(cx='20' cy='20' r='20' transform='translate(0 -0.367)' :fill='form.primaryColor')
                  text#f(transform='translate(10.145 4.644)' fill='#fff' font-size='24' font-family='Lato-Regular, Lato')
                    tspan(x='3.104' y='24') F
                g#Group_2740(data-name='Group 2740' transform='translate(1295 892.734)')
                  rect#Rectangle_185-5(data-name='Rectangle 185' width='86.5' height='10' rx='5' transform='translate(0)' :fill='form.patternColor')
                rect#Rectangle_663(data-name='Rectangle 663' width='55' height='55' rx='10' transform='translate(1295 1207)' fill='#f1f1f3')
                rect#Rectangle_666(data-name='Rectangle 666' width='55' height='55' rx='10' transform='translate(1295 1148)' fill='#f1f1f3')
                g#Group_2763(data-name='Group 2763' transform='translate(551 1003)')
                  rect#Rectangle_670(data-name='Rectangle 670' width='15' height='15' rx='5' :fill='form.primaryColor')
                  rect#Rectangle_671(data-name='Rectangle 671' width='15' height='15' rx='5' transform='translate(0 25)' fill='#f1f1f3')
                  rect#Rectangle_672(data-name='Rectangle 672' width='15' height='15' rx='5' transform='translate(0 50)' fill='#f1f1f3')
                  rect#Rectangle_673(data-name='Rectangle 673' width='15' height='15' rx='5' transform='translate(0 75)' fill='#f1f1f3')
                rect#Rectangle_664(data-name='Rectangle 664' width='55' height='55' rx='10' transform='translate(1354 1207)' fill='#f1f1f3')
                rect#Rectangle_665(data-name='Rectangle 665' width='55' height='55' rx='10' transform='translate(1354 1148)' fill='#f1f1f3')
                rect#Rectangle_667(data-name='Rectangle 667' width='143' height='219' rx='25' transform='translate(1072 1016)' fill='#fff')
                g#Group_2742(data-name='Group 2742' transform='translate(630 846.895)')
                  rect#Rectangle_185-6(data-name='Rectangle 185' width='63.063' height='10' rx='5' transform='translate(0)' :fill='form.patternColor')
                g#Group_2745(data-name='Group 2745' transform='translate(630 1017.044)')
                  rect#Rectangle_668(data-name='Rectangle 668' width='98' height='71' rx='25' transform='translate(0 -0.045)' fill='#fff')
                  g#Group_2743(data-name='Group 2743' transform='translate(17.469 18.426)')
                    rect#Rectangle_185-7(data-name='Rectangle 185' width='31.531' height='10' rx='5' transform='translate(0)' :fill='form.patternColor')
                  g#Group_2744(data-name='Group 2744' transform='translate(17.469 39.907)')
                    rect#Rectangle_185-8(data-name='Rectangle 185' width='15.766' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                rect#Rectangle_668-2(data-name='Rectangle 668' width='209' height='138' rx='25' transform='translate(630 1097)' fill='#fff')
                rect#Rectangle_669(data-name='Rectangle 669' width='209' height='138' rx='25' transform='translate(851 1097)' fill='#fff')
                g#Group_2743-2(data-name='Group 2743' transform='translate(647.469 1116.589)')
                  rect#Rectangle_185-9(data-name='Rectangle 185' width='31.531' height='10' rx='5' transform='translate(0)' :fill='form.patternColor')
                g#Group_2762(data-name='Group 2762' transform='translate(868.469 1116.589)')
                  rect#Rectangle_185-10(data-name='Rectangle 185' width='31.531' height='10' rx='5' transform='translate(0)' :fill='form.patternColor')
                g#Group_2744-2(data-name='Group 2744' transform='translate(647.469 1149.194)')
                  rect#Rectangle_185-11(data-name='Rectangle 185' width='176.137' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2761(data-name='Group 2761' transform='translate(868.469 1149.194)')
                  rect#Rectangle_185-12(data-name='Rectangle 185' width='176.137' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2756(data-name='Group 2756' transform='translate(647.469 1162.791)')
                  rect#Rectangle_185-13(data-name='Rectangle 185' width='176.137' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2760(data-name='Group 2760' transform='translate(868.469 1162.791)')
                  rect#Rectangle_185-14(data-name='Rectangle 185' width='176.137' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2757(data-name='Group 2757' transform='translate(647.469 1176.387)')
                  rect#Rectangle_185-15(data-name='Rectangle 185' width='93.531' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2759(data-name='Group 2759' transform='translate(868.469 1176.387)')
                  rect#Rectangle_185-16(data-name='Rectangle 185' width='93.531' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2746(data-name='Group 2746' transform='translate(741 1017.044)')
                  rect#Rectangle_668-3(data-name='Rectangle 668' width='98' height='71' rx='25' transform='translate(0 -0.045)' fill='#fff')
                  g#Group_2743-3(data-name='Group 2743' transform='translate(17.286 18.426)')
                    rect#Rectangle_185-17(data-name='Rectangle 185' width='31.531' height='10' rx='5' transform='translate(0)' :fill='form.patternColor')
                  g#Group_2744-3(data-name='Group 2744' transform='translate(17.286 39.907)')
                    rect#Rectangle_185-18(data-name='Rectangle 185' width='15.766' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2747(data-name='Group 2747' transform='translate(852 1017.044)')
                  rect#Rectangle_668-4(data-name='Rectangle 668' width='98' height='71' rx='25' transform='translate(0 -0.045)' fill='#fff')
                  g#Group_2743-4(data-name='Group 2743' transform='translate(17.104 18.426)')
                    rect#Rectangle_185-19(data-name='Rectangle 185' width='31.531' height='10' rx='5' transform='translate(0)' :fill='form.patternColor')
                  g#Group_2744-4(data-name='Group 2744' transform='translate(17.104 39.907)')
                    rect#Rectangle_185-20(data-name='Rectangle 185' width='15.766' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2748(data-name='Group 2748' transform='translate(962 1017.044)')
                  rect#Rectangle_668-5(data-name='Rectangle 668' width='98' height='71' rx='25' transform='translate(0 -0.045)' fill='#fff')
                  g#Group_2743-5(data-name='Group 2743' transform='translate(17.922 18.426)')
                    rect#Rectangle_185-21(data-name='Rectangle 185' width='31.531' height='10' rx='5' transform='translate(0)' :fill='form.patternColor')
                  g#Group_2744-5(data-name='Group 2744' transform='translate(17.922 39.907)')
                    rect#Rectangle_185-22(data-name='Rectangle 185' width='15.766' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                g#Group_2750(data-name='Group 2750' transform='translate(1091.922 1035.229)')
                  rect#Rectangle_185-23(data-name='Rectangle 185' width='31.531' height='10' rx='5' transform='translate(0)' :fill='form.patternColor')
                g#Group_2752(data-name='Group 2752' transform='translate(1092 1074.035)')
                  g#Group_2749(data-name='Group 2749' transform='translate(29 15.59)')
                    rect#Rectangle_185-24(data-name='Rectangle 185' width='40' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                  g#Group_2751(data-name='Group 2751' transform='translate(28.922 0.127)')
                    rect#Rectangle_185-25(data-name='Rectangle 185' width='60.731' height='8.313' rx='4.157' transform='translate(0)' :fill='form.patternColor')
                  circle#Ellipse_378(data-name='Ellipse 378' cx='9.5' cy='9.5' r='9.5' transform='translate(0 -0.035)' :fill='form.primaryColor')
                g#Group_2753(data-name='Group 2753' transform='translate(1092 1113.602)')
                  g#Group_2749-2(data-name='Group 2749' transform='translate(29 15.463)')
                    rect#Rectangle_185-26(data-name='Rectangle 185' width='40' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                  g#Group_2751-2(data-name='Group 2751' transform='translate(28.922)')
                    rect#Rectangle_185-27(data-name='Rectangle 185' width='60.731' height='8.313' rx='4.157' transform='translate(0)' :fill='form.patternColor')
                  circle#Ellipse_378-2(data-name='Ellipse 378' cx='9.5' cy='9.5' r='9.5' :fill='form.primaryColor')
                g#Group_2754(data-name='Group 2754' transform='translate(1092 1153.042)')
                  g#Group_2749-3(data-name='Group 2749' transform='translate(29 15.463)')
                    rect#Rectangle_185-28(data-name='Rectangle 185' width='40' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                  g#Group_2751-3(data-name='Group 2751' transform='translate(28.922)')
                    rect#Rectangle_185-29(data-name='Rectangle 185' width='60.731' height='8.313' rx='4.157' transform='translate(0)' :fill='form.patternColor')
                  circle#Ellipse_378-3(data-name='Ellipse 378' cx='9.5' cy='9.5' r='9.5' :fill='form.primaryColor')
                g#Group_2755(data-name='Group 2755' transform='translate(1092 1192.788)')
                  g#Group_2749-4(data-name='Group 2749' transform='translate(29 15.463)')
                    rect#Rectangle_185-30(data-name='Rectangle 185' width='40' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                  g#Group_2751-4(data-name='Group 2751' transform='translate(28.922)')
                    rect#Rectangle_185-31(data-name='Rectangle 185' width='60.731' height='8.313' rx='4.157' transform='translate(0)' :fill='form.patternColor')
                  circle#Ellipse_378-4(data-name='Ellipse 378' cx='9.5' cy='9.5' r='9.5' :fill='form.primaryColor')
                g#Group_2758(data-name='Group 2758' transform='translate(647.469 1198.98)')
                  rect#Rectangle_185-32(data-name='Rectangle 185' width='67.755' height='17.83' rx='8.915' transform='translate(0)' :fill='form.primaryColor')
                g#Group_2770(data-name='Group 2770' transform='translate(1295 982.758)')
                  rect#Rectangle_674(data-name='Rectangle 674' width='19' height='19' rx='5' :fill='form.primaryColor')
                  rect#Rectangle_675(data-name='Rectangle 675' width='19' height='19' rx='5' transform='translate(0 34.398)' :fill='form.primaryColor')
                  rect#Rectangle_676(data-name='Rectangle 676' width='19' height='19' rx='5' transform='translate(0 68.797)' :fill='form.primaryColor')
                  g#Group_2764(data-name='Group 2764' transform='translate(27.078 15.463)')
                    rect#Rectangle_185-33(data-name='Rectangle 185' width='40' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                  g#Group_2767(data-name='Group 2767' transform='translate(27.078 49.861)')
                    rect#Rectangle_185-34(data-name='Rectangle 185' width='40' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                  g#Group_2769(data-name='Group 2769' transform='translate(27.078 84.26)')
                    rect#Rectangle_185-35(data-name='Rectangle 185' width='40' height='3.537' rx='1.769' transform='translate(0)' fill='#cbcdd1')
                  g#Group_2765(data-name='Group 2765' transform='translate(27)')
                    rect#Rectangle_185-36(data-name='Rectangle 185' width='60.731' height='8.313' rx='4.157' transform='translate(0)' :fill='form.patternColor')
                  g#Group_2766(data-name='Group 2766' transform='translate(27 34.398)')
                    rect#Rectangle_185-37(data-name='Rectangle 185' width='60.731' height='8.313' rx='4.157' transform='translate(0)' :fill='form.patternColor')
                  g#Group_2768(data-name='Group 2768' transform='translate(27 68.797)')
                    rect#Rectangle_185-38(data-name='Rectangle 185' width='60.731' height='8.313' rx='4.157' transform='translate(0)' :fill='form.patternColor')
                circle#Ellipse_379(data-name='Ellipse 379' cx='4' cy='4' r='4' transform='translate(1308 981)' fill='#ef3f69')
                g#Group_2771(data-name='Group 2771' transform='translate(1295 907.705)')
                  rect#Rectangle_185-39(data-name='Rectangle 185' width='40' height='8.044' rx='4.022' transform='translate(0)' :fill='form.secondaryColor')
                rect#Rectangle_678(data-name='Rectangle 678' width='25' height='25' rx='12.5' transform='translate(546 841)' fill='#2b4835')
                g#Group_2780(data-name='Group 2780' transform='translate(552.187 845.865)')
                  g#Group_1427(data-name='Group 1427')
                    path#Path_201(data-name='Path 201' d='M821.028-103.025a5.1,5.1,0,0,1-1.63-1.461,4.93,4.93,0,0,1-.685-1.536c-.04-.155,0-.22.134-.278.206-.088.439-.312.6-.264.181.055.129.392.2.6a3.8,3.8,0,0,0,1.183,1.728.3.3,0,0,0,.461.009,3.646,3.646,0,0,0-.281-5.883,5.656,5.656,0,0,1-1.45-1.224,4.544,4.544,0,0,1,1.273-6.727.359.359,0,0,1,.419-.024,4.54,4.54,0,0,1,2.163,2.9c.054.211-.032.306-.22.391-.525.238-.522.247-.668-.294a3.688,3.688,0,0,0-1.258-1.925.274.274,0,0,0-.416,0,3.64,3.64,0,0,0,.313,5.934,4.877,4.877,0,0,1,2.026,2.281,4.531,4.531,0,0,1-1.883,5.619c-.076.045-.176.061-.218.155Z' transform='translate(-814.741 118.142)' fill='#30f042')
                    path#Path_202(data-name='Path 202' d='M863.284-64.75a2.55,2.55,0,0,0-.187.66,4.446,4.446,0,0,1-1.269,2,.225.225,0,0,1-.334.021,4.43,4.43,0,0,0-4.133-.445c-.2.074-.278-.042-.4-.117s-.092-.187-.059-.3a4.179,4.179,0,0,1,2.835-2.951,4.139,4.139,0,0,1,3.2.242c.121.06.232.141.348.212Z' transform='translate(-850.65 69.321)' fill='#248c33')
                    path#Path_203(data-name='Path 203' d='M873.522-4.371a7.39,7.39,0,0,1-1.459.521,4.422,4.422,0,0,1-1.975-.089c-.117-.033-.192-.058-.182-.22a4.69,4.69,0,0,0-2.07-4.334.5.5,0,0,1-.053-.056,2.142,2.142,0,0,1,.9-.24,3.661,3.661,0,0,1,.857-.03,3.158,3.158,0,0,1,1.095.215,4.277,4.277,0,0,1,1.728,1.126,4.236,4.236,0,0,1,1.1,2.274c.006.042.013.079.06.093Z' transform='translate(-860.888 15.603)' fill='#248c33')
                    path#Path_204(data-name='Path 204' d='M758.722,10.86a4.414,4.414,0,0,1-1.993-.536.3.3,0,0,1-.191-.307,4.383,4.383,0,0,1,1.47-3.173.208.208,0,0,1,.311-.017,4.983,4.983,0,0,0,1.966.736,3.726,3.726,0,0,0,2.1-.268c.247-.094.339.041.49.141s.048.22.018.321A4.288,4.288,0,0,1,758.722,10.86Z' transform='translate(-756.537 0.975)' fill='#248c33')
                    path#Path_205(data-name='Path 205' d='M762.3-60.811a4.22,4.22,0,0,1-4.579-1.07,4.391,4.391,0,0,1-1.168-2.8.359.359,0,0,1,.235-.4,5.419,5.419,0,0,1,1.529-.439,4.648,4.648,0,0,1,1.384.037c.123.019.24.076.362.1s.11.084.1.177a4.811,4.811,0,0,0,1.083,3.476A4.482,4.482,0,0,0,762.3-60.811Z' transform='translate(-756.55 68.823)' fill='#248c33')

      .row.full-width.justify-between.q-mt-xl
        .col-3.q-pr-sm
          .label.full-width Homepage - header
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
                v-model='form.homepageHeader'
              )
        .col-9.q-pl-sm
          .label.full-width Homepage - subtitle
          q-input.q-my-sm.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="140"
                outlined
                placeholder="Max 140 characters"
                ref="nickname"
                rounded
                v-model='form.homepageSubtitle'
              )

      .row.full-width.justify-between.q-mt-xl
        .col-3.q-pr-sm
          .label.full-width Proposals - header
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
                v-model='form.proposalsHeader'
              )
        .col-9.q-pl-sm
          .label.full-width Proposals - subtitle
          q-input.q-my-sm.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="140"
                outlined
                placeholder="Max 140 characters"
                ref="nickname"
                rounded
                v-model='form.proposalsSubtitle'
              )

      .row.full-width.justify-between.q-mt-xl
        .col-3.q-pr-sm
          .label.full-width Members - header
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
                v-model='form.membersHeader'
              )
        .col-9.q-pl-sm
          .label.full-width Members - subtitle
          q-input.q-my-sm.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="140"
                outlined
                placeholder="Max 140 characters"
                ref="nickname"
                rounded
                v-model='form.membersSubtitle'
              )

      .row.full-width.justify-between.q-mt-xl
        .col-3.q-pr-sm
          .label.full-width Organization - header
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
                v-model='form.organizationHeader'
              )
        .col-9.q-pl-sm
          .label.full-width Organization - subtitle
          q-input.q-my-sm.rounded-border(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="140"
                outlined
                placeholder="Max 140 characters"
                ref="nickname"
                rounded
                v-model='form.organizationSubtitle'
              )
  nav.full-width.q-my-xl.row.justify-end(v-show="isAdmin")
    q-btn.q-px-xl.rounded-border.text-bold.q-mr-xs(
      @click="onReset"
      color="white"
      text-color="primary"
      no-caps
      rounded
      unelevated
      :disable="numberOfChanges === 0"
    ) Reset changes
    div.inline.relative-position
      q-btn.q-px-xl.rounded-border.text-bold.q-ml-xs(
        @click="onSave"
        color="primary"
        no-caps
        rounded
        unelevated
        :disable="numberOfChanges === 0"
      ) Save changes
      q-badge(v-show="numberOfChanges > 0" rounded color="red" :label="numberOfChanges" class="notification-badge" size='10px')
</template>

<style lang="stylus" scoped>
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

.notification-badge
  position: absolute;
  z-index: 1000;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  font-size: 10px;
</style>
