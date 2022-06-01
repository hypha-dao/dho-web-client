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
    },

    hasMore: Boolean
  },

  methods: {
    onSeeMore () {
      this.$emit('onSeeMore')
    }

  }
}
</script>

<template lang="pug">
widget(title="Organizations")
  q-list(v-if="organizations && organizations.length")
    template(v-for="(organisation, index) in organizations")
      q-item(:key="index" :class="index===0 && 'q-mt-md'" ripple="false" :to="'/' + organisation.url ").list-item.q-py-md.q-px-none.cursor-pointer.row.justify-center.items-center
        q-item-section(avatar)
          q-avatar(size="xl")
            img(:src="organisation.logo")
        q-item-section.text-body1.text-bold.creator(lines="1") {{ organisation.name || organisation.title }}
        q-btn(round unelevated icon="fas fa-chevron-right" color="inherit" text-color="disabled" size="sm" :ripple="false" )
  .q-pt-md.flex.flex-center(v-if="true")
      q-btn.q-pa-xs(
        flat size="sm"
        color="primary"
        label="See more"
        v-show="hasMore"
        @click="onSeeMore"
      ).button
</template>

<style lang="stylus" scoped>
.list-item
  /deep/.q-focus-helper
    display none !important
.button
  /deep/.q-focus-helper
    display none !important
</style>
