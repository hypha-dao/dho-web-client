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
  // .row.items-center.justify-between.q-mb-md
    q-btn(icon="fas fa-cog" label="Admin")
  .row.full-width.q-my-md
    .col-9.q-pr-sm
      widget
        q-img(src="circle-example.png")
    .col-3.q-pl-sm
      .row.q-col-gutter-md.q-pa-md
        .col-6
          q-btn.fit(:to="{ name: 'treasury' }" rounded unelevated color="white" size="0.9em")
            q-icon.q-pa-md(color="grey-7" size="lg" name="fas fa-balance-scale")
            .item-subtitle2.text-no-wrap.text-grey-7 Treasury
        .col-6
          q-btn.fit(:to="{ name: `archetypes` }" rounded unelevated color="white" size="0.9em")
            q-icon.q-pa-md(color="grey-7" size="lg" name="fas fa-user-tag")
            .item-subtitle2.text-no-wrap.text-grey-7 Archetypes
        .col-6
          q-btn.fit(:to="{ name: `multi-sig` }" rounded unelevated color="white" size="0.9em")
            q-icon.q-pa-md(color="grey-7" size="lg" name="far fa-handshake")
            .item-subtitle2.text-no-wrap.text-grey-7 Multi Sig
        .col-6
          q-btn.fit(:to="{ name: 'documents' }" rounded unelevated color="white" size="0.9em")
            q-icon.q-pa-md(color="grey-7" size="lg" name="fas fa-file-alt")
            .item-subtitle2.text-no-wrap.text-grey-7 Documents
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
        .text-body2 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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
        .text-body2 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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
        .text-body2 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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
