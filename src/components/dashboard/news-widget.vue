<script>
export default {
  name: 'news-widget',
  components: {
    NewsItem: () => import('./news-item.vue'),
    Widget: () => import('../common/widget.vue')
  },
  props: {
    news: Array // of { title, date, description, author }
  }
}
</script>

<template lang="pug">
widget.news-widget(title="News")
  news-item(v-for="newsItem in news" :key="news.title" :news="newsItem")
</template>
