<script>

export default {
  name: 'organizations',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    organizations: {
      type: Array,
      default: undefined
    }
  }
}
</script>

<template lang="pug">
widget(title="Organizations")
  q-list(v-if="organizations.length")
    template(v-for="(organisation, index) in organizations")
      q-item(:key="index" ripple="false" :to="'/' + organisation.slug + '/home'").q-px-none.cursor-pointer
        q-item-section(avatar)
          q-avatar(size="xl")
            img(:src="organisation.logo")
        q-item-section.text-body1.text-bold.creator(lines="1") {{ organisation.name || organisation.title }}
</template>

<style lang="stylus" scoped>
</style>
