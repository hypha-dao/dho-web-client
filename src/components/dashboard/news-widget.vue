<script>
export default {
  name: 'news-widget',
  components: {
    NewsItem: () => import('./news-item.vue'),
    Widget: () => import('../common/widget.vue')
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
widget.news-widget(title="News")
  div( style="max-height: 500px; overflow: auto;" ref="scrollTargetRef")
    q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollTargetRef")
      template(v-slot:loading)
        div(class="row justify-center q-my-md")
          q-spinner-dots(color="primary" size="40px")
      news-item.q-px-sm(v-for="newsItem in news" :key="news.title" :news="newsItem")
</template>

<style lang="stylus">
/* width */
::-webkit-scrollbar
  width: 2px;

/* Track */
::-webkit-scrollbar-track
  background: inherit;

/* Handle */
::-webkit-scrollbar-thumb
  background: $primary;

/* Handle on hover */
::-webkit-scrollbar-thumb:hover
  background: #555;
</style>
