<script>
export default {
  name: 'profile-sidebar-guest',
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    daoName: String,
    profile: {
      type: Object
    },
    width: {
      type: Number,
      default: 370
    }
  },

  methods: {
    onLogin () {
      if (this.$router.currentRoute.path !== '/login') {
        this.$router.push({ path: `/${this.daoName}/login?returnUrl=${this.$route.path}` })
      }
    }
  }
}
</script>

<template lang="pug">
.profile-sidebar.full-width.full-height
  q-scroll-area.full-height
    .column.justify-between.q-py-xxxl.q-px-xxxl.flex.scrollable-area
      .profile.q-py-md
        .row.justify-between
          profile-picture(username="g" size="88px" textOnly)
          .container
            q-btn(color="internal-bg" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" @click="$emit('close')")
        .h-h3.q-mt-md(v-if="profile") {{ '@guest' }}
        .h-b3.text-body(v-if="profile") {{ 'visitor' }}
      .sidebar-text
        .h-h5 Lorem Ipsum
        .h-b2.text-body Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
      .sidebar-buttons.aling-self-center
        q-btn.full-width.q-mt-xl(
          label="Begin your journey"
          color="primary"
          rounded
          no-caps
          @click="onLogin"
        )
        q-btn.full-width.q-mt-xs(
          label="Login"
          color="secondary"
          rounded
          no-caps
          @click="onLogin"
        )
</template>

<style lang="stylus" scoped>
.scrollable-area
  height 100vh
</style>
