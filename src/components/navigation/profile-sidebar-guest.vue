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
    .column.justify-between.q-py-xl.flex.scrollable-area
      .profile.q-py-md
        .row.justify-between.q-px-lg
          profile-picture(username="g" size="88px" textOnly)
          .container
            q-btn(color="grey-4" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" @click="$emit('close')")
        .h3.q-mt-md.q-px-lg(v-if="profile") {{ '@guest' }}
        .b3.text-grey-6.q-px-lg(v-if="profile") {{ 'visitor' }}
      .sidebar-text.q-mt-md.q-px-lg
        .h5 Lorem Ipsum
        .b2.text-grey-6 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
      .sidebar-buttons.q-px-lg.aling-self-center
        q-btn.full-width.q-mt-xl(
          label="Begin your journey"
          color="primary"
          rounded
          no-caps
          @click="onLogin"
        )
        q-btn.full-width.q-mt-sm(
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
