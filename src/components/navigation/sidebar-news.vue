<script>
/**
 * A component to display sidebar news text
 */
export default {
  name: 'sidebar-news',
  props: {
    announcement: {
      type: Object,
      default: () => null
    },
    daoName: String,
    dhoTitle: String,
    isMember: Boolean,
    username: String
  }
}
</script>

<template lang="pug">
.sidebar-news.full-width
  div(v-if="announcement")
    .row
      .h-h5.text-bold {{ announcement.title }}
    div(v-if="!isMember")
      .row.items-center.q-my-md
        .h-b2 {{ $t('navigation.sidebar-news.weAreCurrently') }}
    div(v-if="isMember")
      .row.items-center.q-my-md
        .h-b2(v-html="announcement.message")
  div(v-else)
    .row
      .h-h5.text-bold {{ $t('navigation.sidebar-news.welcomeTo', { daoName: dhoTitle && dhoTitle.trim().replace(/^\w/, (c) => c.toUpperCase())})}}.
    div(v-if="!isMember")
      .row.items-center.q-my-md
        .h-b2 {{ $t('navigation.sidebar-news.weAreCurrently1') }}
    div(v-if="isMember")
      .row.items-center.q-my-md
        .h-b2 {{ $t('navigation.sidebar-news.niceToSee') }}
      .row.items-center.q-my-md
        .h-b2 {{ $t('navigation.sidebar-news.youCanVoteFor') }}
          router-link(:to="`/${daoName}/proposals`") {{ $t('navigation.sidebar-news.proposals') }}
          | {{ $t('navigation.sidebar-news.searchFor') }}
          router-link(:to="`/${daoName}/members`") {{ $t('navigation.sidebar-news.members') }}
          | {{ $t('navigation.sidebar-news.andFindOut') }}
          router-link(:to="`/${daoName}/organization`") {{ $t('navigation.sidebar-news.organization') }}
          | {{ $t('navigation.sidebar-news.tick') }}
      .row.items-center.q-my-md
        .h-b2 {{ $t('navigation.sidebar-news.beSureTo') }}
          router-link(:to="`/${daoName}/@${username}`") {{ $t('navigation.sidebar-news.profile') }}
          | {{ $t('navigation.sidebar-news.andHaveFun') }}

</template>

<style lang="stylus" scoped>

</style>
