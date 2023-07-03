<script>
export default {
  name: 'create-dho-widget',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }

}
</script>

<template lang="pug">
widget.q-my-md.position-relative(:title="$t('organization.create-dho-widget.createNewDao')")
  q-btn.full-width.q-px-lg(rounded color="primary" no-caps @click="$emit('create')") {{ $t('organization.create-dho-widget.createNewDao1') }}
</template>
