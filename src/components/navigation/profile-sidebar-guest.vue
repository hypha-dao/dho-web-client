<script>
/**
 * A component that displays guest sidebar
 */
export default {
  name: 'profile-sidebar-guest',
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    daoName: String,
    registrationEnabled: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    onLogin () {
      if (this.$router.currentRoute.path !== '/login') {
        this.$router.push({ path: `/${this.daoName}/login?returnUrl=${this.$route.path}` })
      }
      this.$emit('close')
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
        .h-h3.q-mt-md {{ '@Guest' }}
      .sidebar-text
        .h-h5 Welcome to {{ daoName && daoName.replace(/^\w/, (c) => c.toUpperCase()) }}
        .h-b2.text-body As a guest you have full access to all content of the DAO. However, you cannot participate in any decision making or apply for any role or receive any contribution.
      .sidebar-buttons.aling-self-center
        div
          q-btn.full-width.q-mt-xl(
            label="Register new account"
            color="primary"
            rounded
            no-caps
            :disable="!registrationEnabled"
            @click="onLogin"
          )
          q-tooltip(anchor="top middle" v-if="!registrationEnabled") Registration is temporarily disabled
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
