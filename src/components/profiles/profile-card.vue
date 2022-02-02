<script>
import { mapActions, mapGetters } from 'vuex'
import { timeZones } from '~/mixins/time-zones'
import { calcVoicePercentage } from '~/utils/eosio'

export default {
  name: 'profile-card',
  mixins: [timeZones],
  components: {
    Chips: () => import('../common/chips.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    Widget: () => import('../common/widget.vue')
  },

  props: {
    username: String,
    joinedDate: String,
    view: String,
    isApplicant: Boolean
  },

  data () {
    return {
      timezone: '',
      publicData: {
        bio: ''
      },
      voiceToken: {
        token: '',
        amount: 0
      },
      voiceTokenPercentage: 0,
      submittingEnroll: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['isEnroller']),

    list () {
      return this.view === 'list'
    },

    card () {
      return this.view === 'card'
    }
  },
  watch: {
    username: {
      handler: async function () {
        this.getProfileDataFromContract()
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions('profiles', ['getVoiceToken']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('treasury', ['getSupply']),
    ...mapActions('applicants', ['enroll']),

    // How do we optimize this repeated profile requests?
    async getProfileDataFromContract () {
      this.resetCard()
      const profile = await this.getPublicProfile(this.username)
      if (profile) {
        this.publicData = profile.publicData
        const tz = this.timeZonesOptions.find(v => v.value === this.publicData.timeZone)
        if (tz) {
          this.timezone = tz.text.substr(0, tz.text.indexOf(')') + 1)
        } else {
          this.timezone = '(UTC-00:00)'
        }
      }

      this.voiceToken = await this.getVoiceToken(this.username)
      const supplyTokens = await this.getSupply()

      const supplyHVoice = parseFloat(supplyTokens[this.voiceToken.token])
      this.voiceTokenPercentage = supplyHVoice ? calcVoicePercentage(parseFloat(this.voiceToken.amount), supplyHVoice) : '0.0'
    },

    onClick () {
      if (this.username) {
        this.$router.push({ name: 'profile', params: { username: this.username } })
      }
    },

    resetCard () {
      this.publicData = {
        name: this.username,
        bio: ''
      }
      this.timezone = '(UTC-00:00)'
      this.voiceTokenPercentage = '0.0'
    },

    async onEnroll (event) {
      event.stopPropagation()
      this.submittingEnroll = true
      await this.enroll({
        applicant: this.username,
        content: ''
      })
      this.submittingEnroll = false
    }
  }
}
</script>

<template lang="pug">
widget.cursor-pointer(
  no-padding
  :class="{ 'full-width': list }"
  :style="{ 'width': card ? '280px' : 'inherit' }"
  @click.native="onClick"
)
  .row.items-center.justify-between
    .col-2.q-my-md.q-px-xl(:class="{ 'col-12': card }")
      .column(:class="{ 'items-center': card }")
        profile-picture(:username="username" :size="list ? '96px' : '168px'")
    .col.q-mb-md.q-px-lg(:class="{ 'col-12': card, 'text-center': card  }")
      .column(:class="{ 'items-center': card }")
        chips(:tags="[{ outline: true, color: 'primary', label: 'Circle Name' }]" v-if="!isApplicant")
        chips(:tags="[{ outline: false, color: 'secondary', label: 'Applicant' }]" v-if="isApplicant")
        .text-h6.text-bold {{ publicData.name }}
        .text-subtitle1.text-weight-thin.text-grey-7 {{ '@' + username }}
    .col-6(:class="{ 'col-12': card, 'q-px-xs': card }" v-if="!isApplicant")
      .row.items-center
        .col-4.q-px-md(:class="{ 'text-center': card }")
          .items-center(:class="{ 'row': list, 'column': card }")
            q-icon.q-pa-sm(color="grey-7" name="fas fa-calendar-alt")
            .text-grey-7.text-no-wrap Joined
            .text-grey-7 {{ new Date(joinedDate).toDateString() }}
        .col-4.q-px-md(:class="{ 'text-center': card, 'left-border': card }")
          .items-center(:class="{ 'row': list, 'column': card }")
            q-icon.q-pa-sm(color="grey-7" name="fas fa-map-marker-alt")
            .text-grey-7 {{ timezone }}
        .col-4.q-px-md(:class="{ 'text-center': card, 'left-border': card }")
          .items-center(:class="{ 'row': list, 'column': card }")
            q-icon.q-pa-sm(color="grey-7" name="fas fa-vote-yea")
            .text-grey-7.text-no-wrap {{ voiceTokenPercentage }}%
            .text-grey-7.text-no-wrap {{ voiceToken.token }}
    .col-6(:class="{ 'col-12': card, 'col-7': isEnroller, 'q-px-xs': card }" v-if="isApplicant")
      .row.items-center
        .col-8.q-px-md(:class="{ 'text-center': card, 'col-12': !isEnroller || card }")
          .items-center(:class="{ 'row': list, 'column': card }")
            .text-grey-7.text-body2 {{publicData.bio.substr(0, card ? 125 : 200) + (publicData.bio.length > 100 ? "..." : "")}}
        .col-4.q-px-md(:class="{ 'text-center': card , 'col-12': card, 'q-mt-md': card}" v-if= "isEnroller")
          q-btn.q-px-lg.full-width(
          color="primary"
          no-caps
          unelevated
          rounded
          label="Enroll"
          @click="onEnroll"
          :loading="submittingEnroll")

  .q-mb-md(v-if="card")
</template>

<style lang="stylus" scoped>
.left-border
  border-left 1px solid $grey-4
</style>
