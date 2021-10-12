<script>
import TimeFormat from '~/mixins/time-format'
export default {
  name: 'news-item',
  mixins: [TimeFormat],
  components: {
    Chips: () => import('~/components/common/chips.vue')
  },
  props: {
    /**
     * An Object with the follow properties
     * title: String
     * date: String
     * description: String
     * author: String
     * tags: Array of { label, color } common/chips component
     */
    news: Object
  }
}
</script>

<template lang="pug">
#main-container.q-py-md
  .row.items-center.justify-between
    #aux-cont
        .row.items-center
            .text-h6 {{ news.title }}
            chips(:tags="news.tags")
    #aux-cont
        .text-caption.text-weight-bold.text-right {{ news.author }}
        .text-caption.text-italic {{ news.date | timeAgo}}
  .text-body2.q-mt-sm.text-weight-thin {{ news.description }}
</template>

<style lang="stylus">
</style>
