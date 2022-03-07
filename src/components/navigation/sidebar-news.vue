<script>
export default {
  name: 'sidebar-news',
  props: {
    username: String,
    daoName: String
  }
}
</script>

<template lang="pug">
.sidebar-news.full-width.q-px-lg
  .row
    .text-h6.text-bold Welcome to {{daoName}}.
  .row.items-center.q-my-md
    .text-body.text-body2 Nice to see you here. Go take a look around. This DAO is here to help you govern your decentralized organisation, reduce coordination cost and build your organisation.
  .row.items-center.q-my-md
    .text-body.text-body2 You can vote for <router-link :to="`/${daoName}/proposals`">proposals</router-link>, find other <router-link :to="`/${daoName}/members`">members</router-link> and find out what makes your <router-link :to="`/${daoName}/organization`">organization</router-link> what it is.
  .row.items-center.q-my-md
    .text-body.text-body2 Go to your <router-link :to="`/${daoName}/@${username}`">profile</router-link> and make sure its complete.
  .row.items-center.q-my-md
    .text-body.text-body2 And most importantly - have fun and do the DHO.
</template>

<style lang="stylus" scoped>

</style>
