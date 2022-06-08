<script>
export default {
  name: 'news-widget',
  components: {
    NewsItem: () => import('./news-item.vue'),
    Widget: () => import('../common/widget.vue'),
    ComingSoonTag: () => import('~/components/common/coming-soon-tag'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },
  props: {
    /**
     * News Array List of { title, date, description, author, type }
    */
    news: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onLoad (index, done) {
      this.$emit('loadMore', index, done)
    }
  }
}
</script>

<template lang="pug">
widget.news-widget(title="Latest News")
  coming-soon-tag(message="IN DEVELOPMENT - COMING SOON")
  div( style="max-height: 400px; overflow: auto;" ref="scrollTargetRef")
    q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollTargetRef")
      template(v-slot:loading)
        div(class="row justify-center q-my-md")
          loading-spinner(color="primary" size="40px")
      news-item.q-px-sm(v-for="newsItem in news" :key="newsItem.title" v-bind="newsItem")
</template>

<style lang="stylus">
</style>
