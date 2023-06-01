<script>
import { mapGetters } from 'vuex'

export default {
  name: 'welcome-view',

  props: {
    isOnboarding: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao'])
  }
}
</script>
<template lang="pug">
.full-width.full-height.flex(:class="{ 'items-start':$q.platform.is.mobile, 'items-center':$q.platform.is.desktop }")
  .full-width
    .h-h1-signup.text-heading
      | {{ isOnboarding ? 'Launch your' : 'Welcome to' }}
      .text-weight-800 {{ isOnboarding ? 'first DAO' : selectedDao?.title?.replace(/^\w/, (c) => c.toUpperCase()) }}
    .h-h4.color-secondary.q-my-xxxl(v-if="$q.platform?.is.desktop && isOnboarding") You need an Hypha Account to interact with Hypha Ecosystem and create a DAO.
    .h-b1-signup.text-h-gray.q-py-xl.leading-loose(v-if="$q.platform?.is.desktop && isOnboarding")
      | {{ isOnboarding ? 'If you already have an Hypha Account click the log-in button, validate the trasaction with Anchor Walley and start creating your DAO.' : 'You need an hypha account to interact with Hypha DAOs. <b>If this is your first time here,</b> click Create new Hypha account and follow the steps. <b>If you already have an Hypha Account and Anchor wallet configured</b>, click the log-in button, validate the transaction with Anchor Wallet and enter the DAO.' }}
    .h-b1-signup.color-secondary.text-weight-thin.q-mt-lg.q-mb-lg.text-grey.custom-calc-margin(v-if="$q.platform.is.mobile") The DHO (Decentralized Human Organization) is a framework to build your organization from the ground up in an organic and participative way and together with others.
    q-btn.full-width.q-mt-xl.text-bold(
      :disable="false"
      @click="$emit('onRegisterClick')"
      color="primary"
      label="Create new Hypha account"
      no-caps
      rounded
      unelevated
    )
      q-tooltip(v-if="false" anchor="top middle") Registration is temporarily disabled
    q-btn.full-width.q-mt-sm.text-bold(
      @click="$emit('onLoginClick')"
      color="secondary"
      label="Login"
      no-caps
      rounded
      unelevated
    )
    q-btn.full-width.q-mt-sm.text-bold(
      :to="{ name:'dashboard' }"
      color="primary"
      label="Continue as a guest"
      no-caps
      outline
      rounded
      unelevated
      v-if="!isOnboarding"
    )
    .h-b1-signup.text-h-gray.q-py-xl.row.items-center Use an existing
      q-btn(flat color="primary" no-caps padding="none" @click="onPreviousStep").q-pa-none.text-underline.q-ml-xxs blockhain account
</template>

<style lang="stylus" scoped>
</style>
