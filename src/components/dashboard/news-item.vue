<script>
import TimeFormat from '~/mixins/time-format'
export default {
  name: 'news-item',
  mixins: [TimeFormat],
  components: {
    Chips: () => import('~/components/common/chips.vue')
  },
  props: {
    // news: () => {} // of { title, date, description, author }
    news: Object
  },
  computed: {
    tagType () {
      let color
      switch (this.news.type) {
        case 'announcement':
          color = 'primary'
          break
        case 'new feature':
          color = 'grey-6'
          break
        default:
          color = 'primary'
          break
      }
      return [{
        label: this.news.type.toUpperCase(),
        color
      }]
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
            chips(:tags="tagType")
            //- .text-caption.q-ml-md.type.text-uppercase(:class="getTypeStyle(news.type)") {{ news.type }}
    #aux-cont
        .text-caption.text-weight-bold.text-right {{ news.author }}
        .text-caption.text-italic {{ news.date | timeAgo }}
  .text-body2.q-mt-sm.text-weight-thin {{ news.description }}
</template>

<style lang="stylus">
</style>
