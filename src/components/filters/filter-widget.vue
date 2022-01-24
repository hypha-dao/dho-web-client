<script>
export default {
  name: 'filter-widget',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    Widget: () => import('../common/widget.vue')
  },

  watch: {
    view: { handler: function (value) { this.$emit('update:view', value) }, immediate: true },
    sort: { handler: function (value) { this.$emit('update:sort', value) }, immediate: true },
    textFilter: { handler: function (value) { this.$emit('update:textFilter', value) }, immediate: true },
    circle: { handler: function (value) { this.$emit('update:circle', value) }, immediate: true },
    filters: { handler: function (value) { this.$emit('update:filters', value) }, immediate: true }
  },

  props: {
    optionArray: Array,
    circleArray: Array,
    filters: Array,
    viewSelectorLabel: String,
    chipsFiltersLabel: String
  },

  mounted: function () {
    this.sort = this.optionArray?.[0]
    this.circle = this.circleArray?.[0]
    this.view = 'card'
  },
  methods: {

    toggleFilter (tag) {
      const filter = this.filters?.find(f => f.label === tag.label)
      if (filter) {
        filter.enabled = !filter.enabled
      }
    }
  },

  computed: {
    filterTags () {
      const tags = []
      this.filters?.forEach((option) => {
        tags.push({
          color: option.enabled ? 'primary' : 'grey-4',
          text: option.enabled ? 'white' : 'grey-7',
          label: option.label
        })
      })

      return tags
    }
  },

  data () {
    return {
      sort: '',
      textFilter: null,
      circle: '',
      view: ''
    }
  }
}
</script>

<template lang="pug">
    widget(title="Filters")
      .row.full-width.items-center.justify-between.q-pa-sm
        q-input.rounded-border.full-width(outlined v-model="textFilter" label="Filter by name")
      .row.full-width.items-center.justify-between.q-pa-sm
        .text-grey-6 {{ viewSelectorLabel }}
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
        q-select.full-width(dense filled v-model="sort" :options="optionArray")
      .row.full-width.q-pa-sm
        q-select.full-width(dense filled v-model="circle" :options="circleArray")
      .row.full-width.q-my-md
          .text-subtitle1.q-mb-sm {{ chipsFiltersLabel }}
          chips(:tags="filterTags" clickable @click-tag="toggleFilter" )
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
