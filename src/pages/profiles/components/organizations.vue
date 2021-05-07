<script>
export default {
  name: 'organizations',
  components: {
    Widget: () => import('~/components/widget.vue')
  }
}
</script>

<template lang="pug">
widget(title="Organizations")
  q-list
    q-item(clickable v-ripple).org-item
      q-item-section(avatar)
        q-avatar(size="md")
          // img(src="~assets/logo/hypha72x72.png")
      q-item-section
        q-item-label.text-body1.text-bold Hypha DHO
      q-item-section(side)
        q-icon(name="fas fa-chevron-right" size="xs")
    // q-separator(spaced inset)
    q-item(clickable v-ripple).org-item
      q-item-section(avatar)
        q-avatar(size="md")
          // img(src="~assets/logo/hypha72x72.png")
      q-item-section
        q-item-label.text-body1.text-bold Hypha DHO
      q-item-section(side)
        q-icon(name="fas fa-chevron-right" size="xs")
</template>

<style lang="stylus" scoped>
.org-item
  color #728191
</style>
