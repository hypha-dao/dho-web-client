<script>
export default {
  name: 'organizations',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  methods: {
    imageUrl (icon) {
      return require('~/assets/icons/' + icon)
    }
  }
}
</script>

<template lang="pug">
widget(title="Organizations")
  q-list
    q-item.q-px-none
      q-item-section(avatar)
        q-avatar(size="md")
          img(src="app-logo-128x128.png")
      q-item-section
        q-item-label.text-body1.text-bold Hypha DHO
      // q-item-section(side)
        q-icon(name="fas fa-chevron-right" size="xs")
    // q-separator(spaced inset)
    q-item.q-px-none
      q-item-section(avatar)
        q-avatar(size="md")
          img(:src="imageUrl('seeds.png')")
      q-item-section
        q-item-label.text-body1.text-bold Seeds DHO
      // q-item-section(side)
        q-icon(name="fas fa-chevron-right" size="xs")
</template>
