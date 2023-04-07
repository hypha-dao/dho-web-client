<script>
export default {
  name: 'create-dho-widget',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }

}
</script>

<template lang="pug">
widget.q-my-md.position-relative(title="Create new DAO")
  //- TODO: Add real copy
  //- .text-ellipsis.text-body.leading-loose.q-my-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
  q-btn.full-width.q-px-lg(rounded color="primary" no-caps @click="$emit('create')") Create New DAO
</template>
