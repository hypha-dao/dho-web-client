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
  .row.items-center.justify-between
    .text-subtitle1 Preview the new Hypha DHO!
    .text-caption 1 Aug 2021
  .text-body2.q-mt-sm This is a preview of the new Hypha DHO platform, bringing a new look, streamlined navigation and support for the next generation of DHO's! It is a work-in-progress. While still in preview mode, content and design is still subject to change. Feel free to explore the new layout and provide your feedback to the product team! There is a banner located on every page that gives the status for that page. This news feed will include updates as they are added to the preview!
</template>
