<script>

const params = {
  url: 'URL',
  title: 'Name',

  proposalsCreationEnabled: 'Proposals creation',
  membersApplicationEnabled: 'Members application',
  removableBannersEnabled: 'Removable banners',

  votingAlignmentPercent: 'Vote alignment (Unity)',
  votingQuorumPercent: 'Vote quorum'
}

export default {
  name: 'multisig-modal',
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {

    activeMultisig: {
      type: Object,
      default: () => {}
    },

    form: {
      type: Object,
      default: () => {}
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    isHypha: {
      type: Boolean,
      default: false
    },

    open: Boolean,
    state: String
  },

  data () {
    return {
      columns: [
        { name: 'name', label: 'Label', align: 'left', field: 'name' },
        { name: 'current', label: 'Current', align: 'left', field: 'current' },
        { name: 'proposed', align: 'left', label: 'Proposed', field: 'proposed' }
      ],

      rows: []
    }
  },

  computed: {
    singers () {
      return this.activeMultisig &&
      this.activeMultisig.approvedby &&
      this.activeMultisig.approvedby.map(_ => _.details_member_n)
    }
  },

  watch: {
    open: {
      immediate: true,
      deep: true,
      async handler (value) {
        this.rows = [
          ...Object.keys(params).map(param => ({
            ...this.activeMultisig[param] && this.activeMultisig[param] !== this.form[param] ? { name: params[param], current: this.form[param], proposed: this.activeMultisig[param] } : {}
          })).filter(_ => _.name)
        ]
      }
    }
  }

}
</script>

<template lang="pug">
q-dialog(:value="open" persistent)
  .bg-external-bg.rounded-border(:style="{'min-width':'680px'}")
    header.bg-primary.q-px-xl.q-py-md.row.h-h4.text-white(:class="{'justify-between h-h5': !$q.screen.gt.sm }" :style="{'border-bottom': '2px solid rgba(255, 255, 255, .2)'}")
      div.full-width.row.justify-end
        q-btn.q-pa-xxs(
          @click="$emit('close')"
          color="negative"
          flat
          icon="fas fa-times"
          round
          size="sl"
        )
      div(:class="{'q-pr-md': $q.screen.gt.sm }")
        span(v-if="state === 'VIEW'") Multisig
        span.text-weight-500.q-pl-xxs(v-if="state === 'VIEW'") proposal
        span(v-if="state === 'CREATE'") Do you want to create multi sig?
        span(v-if="state === 'SIGN'") Do you want to approve changes?
      //- div(:class="{'q-px-sm': $q.screen.gt.sm }" v-if="state === 'VIEW'")
      //-   div.full-height(:style="{'width': '2px', 'background': 'rgba(255, 255, 255, .2)' }")
      //- div.row.items-center.q-gutter-x-sm(v-if="$q.screen.gt.sm && state === 'SIGN'" :class="{'q-pl-xl': $q.screen.gt.sm }")
      //-   q-icon(name="fas fa-exclamation-triangle" size='sm')
      //-   span Action Required

    section.q-px-xl.q-py-md
      //- p.h-b1.text-white.q-my-lg.text-weight-300 We have temporarily suspended your DAO account. But don’t worry, once you reactivate your plan, all the features and users will be waiting for you. Alternatively you can downgrade to a free plan. Be aware that you will lose all the features that are not available in your current plan Please check Terms and conditions to learn more
      div
        h3.q-pa-none.q-ma-none.h-h4.text-weight-700 Changes
        q-table(title="" :data="rows" :columns="columns" row-key="name"  flat bordered :hide-bottom="true")

      div.q-mt-md
        h3.q-pa-none.q-ma-none.h-h4.text-weight-700(v-if="state === 'VIEW'") Signers
        profile-picture(v-for="username in singers" :username="username" :key="username" size="32px")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") {{ username }}

    nav.q-px-xl.q-pb-xl.full-width.row(v-if="state === 'CREATE'")
      .col-6.q-pr-xs
        q-btn.q-px-xl.rounded-border.text-bold.full-width(
          @click="$emit('reset')"
          label="Reset changes"
          color="white"
          no-caps
          rounded
          text-color="primary"
          unelevated
        )
      .col-6.q-pl-xs
        q-btn.q-px-xl.rounded-border.text-bold.full-width(
          @click="$emit('createMultsig')"
          color="positive"
          text-color="white"
          label="Create multi sig"
          no-caps
          rounded
          unelevated
        )

    nav.q-px-xl.q-pb-xl.full-width.row(v-if="state === 'SIGN'")
      .col-6.q-pr-xs
        q-btn.q-px-xl.rounded-border.text-bold.full-width(
          @click="$emit('voteMultsig', false)"
          label="Deny"
          no-caps
          rounded
          color="negative"
          text-color="white"
          unelevated
        )
      .col-6.q-pl-xs
        q-btn.q-px-xl.rounded-border.text-bold.full-width(
          @click="$emit('voteMultsig', true)"
          color="positive"
          text-color="white"
          label="Approve"
          no-caps
          rounded
          unelevated
        )

</template>

<style lang="stylus" scoped>
</style>
