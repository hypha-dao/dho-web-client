<script>
export default {
  name: 'dho-home',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
.dho-home.q-px-xl.q-py-md
  .row.full-width.q-my-md
    widget
      .text-h3.q-mt-xl Welcome to Hypha
      .text-body2.q-my-md Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      q-btn.q-mt-md.q-mb-xl.q-px-lg(rounded color="primary") Discover
  .row.full-width.q-my-md
    .col-3.q-pa-sm
      widget
        q-btn.full-width(icon="far fa-file-alt" flat size="xl" stack padding="lg") Wiki
    .col-3.q-pa-sm
      widget
        q-btn.full-width(icon="far fa-file-alt" flat size="xl" stack padding="lg") Wiki
    .col-3.q-pa-sm
      widget
        q-btn.full-width(icon="far fa-file-alt" flat size="xl" stack padding="lg") Wiki
    .col-3.q-pa-sm
      widget
        q-btn.full-width(icon="far fa-file-alt" flat size="xl" stack padding="lg") Wiki
  .row.full-width.q-my-md
    .col-9.q-pa-sm
      widget(title="Open Proposals (26)")
    .col-3.q-pa-sm
      widget(title="Members (280)")
</template>
