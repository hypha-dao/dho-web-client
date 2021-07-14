<script>
export default {
  name: 'profile-card',
  components: {
    Chips: () => import('../common/chips.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    Widget: () => import('../common/widget.vue')
  },

  props: {
    profile: Object,
    view: String
  },

  computed: {
    list () {
      return this.view === 'list'
    },

    card () {
      return this.view === 'card'
    }
  },

  methods: {
    onClick () {
      if (this.profile.username) {
        this.$router.push({ path: `/bm/@${this.profile.username}` })
      }
    }
  }
}
</script>

<template lang="pug">
widget.cursor-pointer(
  :class="{ 'full-width': list }"
  :style="{ 'max-width': card ? '280px' : 'inherit' }"
  @click.native="onClick"
)
  .row.items-center.justify-between
    .col-6(:class="{ 'col-12': card }")
      profile-picture(v-bind="profile" show-name size="64px")
    .col-6(:class="{ 'col-12': card }")
      .row HVoice 21k (2.5%)
      .row Building and Developing B2
      .row DHO Product Circle
      .row #tags #tags #tags
  .q-mb-md(v-if="card")
</template>
