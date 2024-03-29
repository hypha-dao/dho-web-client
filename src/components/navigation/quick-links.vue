<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'quick-links',

  props: {
    compact: Boolean,
    isMember: Boolean,
    username: String,
    isAuthenticated: Boolean
  },

  data: function () {
    return {
      activeRouteName: null
    }
  },

  methods: {
    ...mapActions('accounts', ['logout']),
    changeRoute (name, params) {
      this.$emit('onClick')
      this.$router.push({ name: name, params })
    },
    isActiveRoute (name) { return this.activeRouteName === name }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),
    cssVars () {
      return {
        '--button-size': this.compact ? '96px' : '134px'
      }
    },
    isUserProfile () {
      const { dhoname, username } = this.$route.params
      return username === this.username && dhoname === this.daoSettings.url
    }
  },

  watch: {
    $route (to) {
      this.activeRouteName = to.name
    }
  }
}
</script>

<template lang="pug">
.quick-links.full-width(:style="cssVars")
  .row.q-col-gutter-xs.justify-center-items-center
    .col-6(:class="{ 'col-12': compact, 'flex': !compact }").justify-end
      q-btn.button-square.items-end(@click.native="$emit('onClick')" :to="isAuthenticated && daoSettings.proposalsCreationEnabled && isMember ? { name: 'proposal-create', params: { dhoname: daoSettings.url } } : {}" rounded unelevated :color="isActiveRoute('proposal-create') ? 'primary' : 'internal-bg'" :text-color="isActiveRoute('proposal-create') ? 'internal-bg' : 'primary'" :disabled="!isAuthenticated || !daoSettings.proposalsCreationEnabled || !isMember")
        q-tooltip(v-if="!daoSettings.proposalsCreationEnabled") {{ $t('navigation.quick-links.thisDaoConfigured') }}
        .column.items-center
          q-icon.q-pa-xs(size="md" name="fas fa-file-medical")
          .text-caption.text-no-wrap.text-bold {{ $t('navigation.quick-links.newProposal') }}
    .col-6.justify-start(:class="{ 'col-12': compact, 'flex': !compact }")
      q-btn.button-square(@click="changeRoute('profile', {username})" rounded unelevated :color="isActiveRoute('profile') && isUserProfile ? 'primary' : 'internal-bg'" :text-color="isActiveRoute('profile') && isUserProfile ? 'internal-bg' : 'primary'")
        .column.items-center
          q-icon.q-pa-xs(size="md" name="far fa-user")
          .text-caption.text-no-wrap.text-bold {{ $t('navigation.quick-links.myProfile') }}
    .col-6.justify-end(:class="{ 'col-12': compact, 'flex': !compact }")
      q-btn.button-square(@click="changeRoute('wallet',{username})" rounded unelevated :color="isActiveRoute('wallet') ? 'primary' : 'internal-bg'" :text-color="isActiveRoute('wallet') ? 'internal-bg' : 'primary'" :disabled="!isAuthenticated")
        .column.items-center
          q-icon.q-pa-xs(size="md" name="fas fa-wallet")
          .text-caption.text-no-wrap.text-bold {{ $t('navigation.quick-links.myWallet') }}
    .col-6.justify-start(:class="{ 'col-12': compact, 'flex': !compact }")
      q-btn.button-square(@click="logout" rounded unelevated color="internal-bg")
        .column.items-center
          q-icon.q-pa-xs(color="primary" size="md" name="fas fa-sign-out-alt")
          .text-caption.text-no-wrap.text-primary.text-bold {{ $t('navigation.quick-links.logout') }}

</template>

<style lang="stylus" scoped>
.button-square
  height var(--button-size)
  width var(--button-size)

.text-caption
  font-size 10px !important
  font-weight 600 !important
  font-family Source Sans Pro, sans-serif !important
</style>
