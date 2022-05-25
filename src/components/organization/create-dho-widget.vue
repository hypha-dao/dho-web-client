<script>
export default {
  name: 'create-dho-widget',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
widget.q-my-md.position-relative(title="Create your DHO")
  .text-ellipsis.text-grey-7.q-my-xl Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  q-btn.q-mt-xl.q-px-lg(rounded color="primary" no-caps @click="$router.push({ name: 'dho-creation' })") New DHO
</template>
