<script>
import TimeFormat from '~/mixins/time-format'
export default {
  name: 'news-item',
  mixins: [TimeFormat],
  props: {
    // news: () => {} // of { title, date, description, author }
    news: Object
  },
  methods: {
    getTypeStyle (type) {
      switch (type) {
        case 'announcement':
          return 'type-announcement'
        case 'new feature':
          return 'type-new-feature'
        default:
          return 'type-normal'
      }
    }
  }
}
</script>

<template lang="pug">
#main-container.q-py-md
  .row.items-center.justify-between
    #aux-cont
        .row.items-center
            .text-h6 {{ news.title }}
            .text-caption.q-ml-md.type.text-uppercase(:class="getTypeStyle(news.type)") {{ news.type }}
    #aux-cont
        .text-caption.text-weight-bold.text-right {{ news.author }}
        .text-caption.text-italic {{ news.date | timeAgo }}
  .text-body2.q-mt-sm.text-weight-thin {{ news.description }}
</template>

<style lang="stylus">
 .type
    padding-left: 10px
    padding-right: 10px
    border-radius: 10px
 .type-announcement
    background-color: black
    color: white
 .type-new-feature
    background-color: #eeeeee
 .type-normal
    display: none
    background-color: inherit
</style>
