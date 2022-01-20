<script>
export default {
  name: 'members-filters',
  components: {
    Widget: () => import('../common/widget.vue')
  },

  watch: {
    view: { handler: function (value) { this.$emit('update:view', value) }, immediate: true },
    sort: { handler: function (value) { this.$emit('update:sort', value) }, immediate: true },
    filter: { handler: function (value) { this.$emit('update:filter', value) }, immediate: true },
    circle: { handler: function (value) { this.$emit('update:circle', value) }, immediate: true }
  },

  data () {
    return {
      options: ['Sort by last added', 'Sort by something else'],
      circles: ['All circles', 'Circle One'],
      sort: 'Sort by last added',
      filter: null,
      circle: 'All circles',
      view: 'card'
    }
  }
}
</script>

<template lang="pug">
    widget(title="Filters")
      .row.full-width.items-center.justify-between.q-pa-sm
        q-input.rounded-border.full-width(outlined v-model="filter" label="Filter by name")
      .row.full-width.items-center.justify-between.q-pa-sm
        .text-grey-6 Members view
        .btn-container
          q-btn.q-mr-sm(
            unelevated
            rounded
            padding="12px"
            size="sm"
            icon="fas fa-th-large"
            :color="view === 'card' ? 'primary' : 'grey-4'"
            :text-color="view === 'card' ? 'white' : 'primary'"
            @click="view = 'card'"
          )
          q-btn(
            unelevated
            rounded
            padding="12px"
            size="sm"
            icon="fas fa-list"
            :color="view === 'list' ? 'primary' : 'grey-4'"
            :text-color="view === 'list' ? 'white' : 'primary'"
            @click="view = 'list'"
          )
      .row.full-width.q-pa-sm
        q-select.full-width(dense filled v-model="sort" :options="options")
      .row.full-width.q-pa-sm
        q-select.full-width(dense filled v-model="circle" :options="circles")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
