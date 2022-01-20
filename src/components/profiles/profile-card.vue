<script>
import { mapActions } from 'vuex'
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
    view: String
  },

  data () {
    return {
      name: '',
      timezone: '',
      publicData: null,
      hVoice: 0.0
    }
  },

  computed: {
    list () {
      return this.view === 'list'
    },

    card () {
      return this.view === 'card'
    }
  },

  async created () {
    this.getProfileDataFromContract()
  },

  methods: {
    ...mapActions('profiles', ['getHVoiceAmount']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('ballots', ['getSupply']),

    // How do we optimize this repeated profile requests?
    async getProfileDataFromContract () {
      if (this.username) {
        const profile = await this.getPublicProfile(this.username)
        if (profile) {
          this.publicData = profile.publicData
          this.name = profile.publicData.name
          const tz = this.timeZonesOptions.find(v => v.value === this.publicData.timeZone)
          this.timezone = tz.text.substr(0, tz.text.indexOf(')') + 1)
        } else {
          this.name = this.username
          this.timezone = '(UTC-00:00)'
        }
        const hVoice = await this.getHVoiceAmount(this.username)
        const supply = parseFloat(await this.getSupply())
        console.log(hVoice, supply)
        this.hVoice = supply ? calcVoicePercentage(parseFloat(hVoice), supply) : '0.0'
      }
    },

    onClick () {
      if (this.username) {
        this.$router.push({ name: 'profile', params: { username: this.username } })
      }
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
    .col.q-my-md.q-px-xl(:class="{ 'col-12': card }")
      .column(:class="{ 'items-center': card }")
        profile-picture(:username="username" :size="list ? '96px' : '168px'")
    .col-4.q-mb-md(:class="{ 'col-12': card, 'text-center': card }")
      .column(:class="{ 'items-center': card }")
        chips(:tags="[{ outline: true, color: 'primary', label: 'Circle Name' }]")
        .text-h6.text-bold {{ name }}
        .text-subtitle1.text-weight-thin.text-grey-7 {{ '@' + username }}
    .col-6(:class="{ 'col-12': card, 'q-px-xs': card }")
      .row.items-center
        .col-4.q-px-md(:class="{ 'text-center': card }")
          .items-center(:class="{ 'row': list, 'column': card }")
            q-icon.q-pa-sm(color="grey-7" name="fas fa-calendar-alt")
            .text-grey-7.text-no-wrap Joined
            .text-grey-7 {{ joinedDate }}
        .col-4.q-px-md(:class="{ 'text-center': card, 'left-border': card }")
          .items-center(:class="{ 'row': list, 'column': card }")
            q-icon.q-pa-sm(color="grey-7" name="fas fa-map-marker-alt")
            .text-grey-7 {{ timezone }}
        .col-4.q-px-md(:class="{ 'text-center': card, 'left-border': card }")
          .items-center(:class="{ 'row': list, 'column': card }")
            q-icon.q-pa-sm(color="grey-7" name="fas fa-vote-yea")
            .text-grey-7.text-no-wrap {{ hVoice }}%
            .text-grey-7.text-no-wrap HVOICE
  .q-mb-md(v-if="card")
</template>

<style lang="stylus" scoped>
.left-border
  border-left 1px solid $grey-4
</style>
