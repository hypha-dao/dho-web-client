<script>
export default {
  name: 'dho-switcher',

  props: {
    dhos: {
      type: Array,
      default: () => [
        {
          name: 'Hypha',
          img: 'app-logo-128x128.png'
        }
      ]
    },
    width: {
      type: Number,
      default: 80
    }
  }
}
</script>

<template lang="pug">
.dho-switcher(:style="{ width: `${width}px` }")
  .column.window-height.justify-center.items-center
    template(v-for="dho in dhos")
      q-btn.q-ma-sm(round :to="{ path: '/bm' }")
        q-avatar(size="56px")
          img(:src="dho.img")
        q-tooltip(
          anchor="top middle"
          self="bottom middle"
          :content-style="{ 'font-size': '1em' }"
        ) {{ dho.name }}
      q-btn.q-ma-sm(fab icon="fas fa-plus" color="primary")
</template>
