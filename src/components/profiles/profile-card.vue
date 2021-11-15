<script>
import { mapActions } from 'vuex'

export default {
  name: 'profile-card',
  components: {
    Chips: () => import('../common/chips.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    Widget: () => import('../common/widget.vue')
  },

  props: {
    username: String,
    view: String
  },

  data () {
    return {
      name: ''
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

  created () {
    this.getName()
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile']),

    // How do we optimize this repeated profile requests?
    async getName () {
      if (this.username) {
        const profile = await this.getPublicProfile(this.username)
        if (profile) {
          this.name = profile.publicData.name
        }
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
            .text-grey-7.text-no-wrap 11 Apr 2011
        .col-4.q-px-md(:class="{ 'text-center': card, 'left-border': card }")
          .items-center(:class="{ 'row': list, 'column': card }")
            q-icon.q-pa-sm(color="grey-7" name="fas fa-map-marker-alt")
            .text-grey-7.text-no-wrap Germany
            .text-grey-7.text-no-wrap UTC-01:00
        .col-4.q-px-md(:class="{ 'text-center': card, 'left-border': card }")
          .items-center(:class="{ 'row': list, 'column': card }")
            q-icon.q-pa-sm(color="grey-7" name="fas fa-vote-yea")
            .text-grey-7.text-no-wrap 2.3%
            .text-grey-7.text-no-wrap HVOICE
  .q-mb-md(v-if="card")
</template>

<style lang="stylus" scoped>
.left-border
  border-left 1px solid $grey-4
</style>
