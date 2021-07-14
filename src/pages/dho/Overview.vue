<script>
export default {
  name: 'dho-overview',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
.dho-overview.q-px-xl
  .row.items-center.justify-between.q-mb-md
    .text-h4 {{ 'About Hypha' }}
    q-btn(icon="fas fa-cog" label="Admin")
  .row.q-col-gutter-md
    .col-3
      widget(title="Circle One")
        .text-body2 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        .text-center.q-my-md
          .text-h2 15
          .text-bold active works
        .row.items-center.justify-between
          .row
            q-avatar(size="sm")
              img(src="avatar-placeholder.png")
            q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
              img(src="avatar-placeholder.png")
            q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
              img(src="avatar-placeholder.png")
          .text-subtitle2.text-italic and other 2
    .col-3
      widget(title="Circle Two")
        text-body2 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        .text-center.q-my-md
          .text-h2 8
          .text-bold active works
        .row.items-center.justify-between
          .row
            q-avatar(size="sm")
              img(src="avatar-placeholder.png")
            q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
              img(src="avatar-placeholder.png")
            q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
              img(src="avatar-placeholder.png")
          .text-subtitle2.text-italic and other 12
    .col-3
      widget(title="Circle Three")
        text-body2 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        .text-center.q-my-md
          .text-h2 54
          .text-bold active works
        .row.items-center.justify-between
          .row
            q-avatar(size="sm")
              img(src="avatar-placeholder.png")
            q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
              img(src="avatar-placeholder.png")
            q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
              img(src="avatar-placeholder.png")
          .text-subtitle2.text-italic and other 21
    .col-3
      widget(title="Circle Four")
        text-body2 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        .text-center.q-my-md
          .text-h2 23
          .text-bold active works
        .row.items-center.justify-between
          .row
            q-avatar(size="sm")
              img(src="avatar-placeholder.png")
            q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
              img(src="avatar-placeholder.png")
            q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
              img(src="avatar-placeholder.png")
          .text-subtitle2.text-italic and other 35
</template>
