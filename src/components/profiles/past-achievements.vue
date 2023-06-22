<script>
export default {
  name: 'past-achievements',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
widget(:title="$t('profiles.past-achievements.pastAchievements')")
  .text-body2 {{ $t('profiles.past-achievements.youHaveNo') }}

</template>
