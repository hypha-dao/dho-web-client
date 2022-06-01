<script>
/**
 * A component to display sidebar news text
 */
export default {
  name: 'sidebar-news',
  props: {
    username: String,
    daoName: String,
    isMember: Boolean
  }
}
</script>

<template lang="pug">
.sidebar-news.full-width
  .row
    .h-h5.text-bold Welcome to {{ daoName && daoName.trim().replace(/^\w/, (c) => c.toUpperCase()) }}.
  div(v-if="!isMember")
    .row.items-center.q-my-md
      .h-b2 We are currently reviewing your application. Please check back at a later time.
  div(v-if="isMember")
    .row.items-center.q-my-md
      .h-b2 Nice to see you here. Go take a look around. This DAO is here to help you govern your decentralized organization, reduce coordination cost and build your vision and purpose.
    .row.items-center.q-my-md
      .h-b2 You can vote for <router-link :to="`/${daoName}/proposals`">proposals</router-link>, search for <router-link :to="`/${daoName}/members`">members</router-link> and find out what makes your <router-link :to="`/${daoName}/organization`">organization</router-link> tick.
    .row.items-center.q-my-md
      .h-b2 Be sure to complete your <router-link :to="`/${daoName}/@${username}`">profile</router-link> and have fun co-creating new and exciting things with your DAO and each-other.
</template>

<style lang="stylus" scoped>

</style>
