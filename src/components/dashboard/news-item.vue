<script>
import TimeFormat from '~/mixins/time-format'
export default {
  name: 'news-item',
  mixins: [TimeFormat],
  components: {
    Chips: () => import('~/components/common/chips.vue')
  },
  props: {
    title: String,
    date: String,
    description: String,
    author: String,
    /**
     * This get an array for chips component example [{ label: 'tag', color: 'blue-5' }]
     */
    tags: Array
  }
}
</script>

<template lang="pug">
#main-container.q-py-md
  .row.items-center.justify-between
    #aux-cont
        chips(:tags="tags")
        .text-h6 {{ title }}
    #aux-cont
        .text-caption.text-weight-bold.text-right {{ author }}
        .text-caption.text-italic posted {{ date | timeAgo}}
  .text-body2.q-mt-sm.text-weight-thin {{ description }}
</template>

<style lang="stylus">
</style>
