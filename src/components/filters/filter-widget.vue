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
    filters: { handler: function (value) { this.$emit('update:filters', value) }, immediate: true },
    toggle: { handler: function (value) { this.$emit('update:toggle', value) }, immediate: true },
    defaultOption: { handler: function (value) { this.sort = this.optionArray ? this.optionArray[value] : '' }, immediate: true },
    circleDefault: { handler: function (value) { this.sort = this.circleArray ? this.circleArray[value] : '' }, immediate: true }
  },

  props: {
    optionArray: Array,
    circleArray: Array,
    filters: Array,
    chipsFiltersLabel: String,
    toggleLabel: String,
    showToggle: Boolean,
    viewSelectorLabel: String,
    showViewSelector: {
      type: Boolean,
      default: true
    },
    showCircle: {
      type: Boolean,
      default: true
    },
    filterTitle: {
      type: String,
      default: 'Filter by name'
    },
    showTextFilter: {
      type: Boolean,
      default: true
    },
    debounce: {
      type: Number,
      default: 0
    },
    defaultOption: {
      type: Number,
      default: 0
    },
    toggleDefault: {
      type: Boolean,
      default: true
    },
    circleDefault: {
      type: Number,
      default: 0
    }
  },

  mounted: function () {
    this.circle = this.circleArray?.[this.circleDefault]
    this.sort = this.optionArray?.[this.defaultOption]
    this.toggle = this.toggleDefault
    this.textFilter = null
    this.view = 'card'
  },

  activated: function () {
    this.circle = this.circleArray?.[this.defaultOption]
    this.toggle = this.toggleDefault
    this.textFilter = null
  },

  methods: {
    toggleFilter (tag) {
      this.$emit('update:filters', this.filters?.map(_ => ({
        ..._,
        enabled: _.value === tag.value ? !_.enabled : _.enabled
      })))
    },
    clearSearchInput () {
      this.textFilter = ''
    },
    resetFilters () {
      this.circle = this.circleArray?.[this.circleDefault]
      this.sort = this.optionArray?.[this.defaultOption]
      this.toggle = this.toggleDefault
      this.textFilter = null
      this.filters.forEach(tag => {
        tag.enabled = false
      })
      this.clearSearchInput()
    }
  },

  computed: {
    filterTags () {
      const tags = []
      this.filters?.forEach((option) => {
        tags.push({
          color: option.enabled ? 'primary' : 'internal-bg',
          text: option.enabled ? 'white' : 'grey-7',
          label: option.label,
          value: option.value
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
      toggle: true,
      view: ''
    }
  }
}
</script>

<template lang="pug">
widget(title="Filters")
      .row.items-center.justify-between.q-py-sm(v-if="showTextFilter")
        q-input.text-filter.rounded-border.full-width(outlined v-model="textFilter" :placeholder="filterTitle" :debounce="debounce" dense)
          template(v-slot:append v-if="textFilter")
            q-icon(size="15px" name="fas fa-times" @click="clearSearchInput")
      .row.items-center.justify-between.q-py-sm(v-if="showViewSelector")
        .h-b2 {{ viewSelectorLabel }}
        .btn-container
          q-btn.q-mr-xxs(
            unelevated
            rounded
            padding="12px"
            size="sm"
            icon="fas fa-th-large"
            :color="view === 'card' ? 'primary' : 'internal-bg'"
            :text-color="view === 'card' ? 'white' : 'primary'"
            @click="view = 'card'"
          )
          q-btn(
            unelevated
            rounded
            padding="12px"
            size="sm"
            icon="fas fa-list"
            :color="view === 'list' ? 'primary' : 'internal-bg'"
            :text-color="view === 'list' ? 'white' : 'primary'"
            @click="view = 'list'"
          )
      .row.q-py-sm
        q-select.full-width(dense v-model="sort" :options="optionArray" hide-bottom-space rounded outlined options-dense bg-color="internal-bg" dropdown-icon="fas fa-chevron-down")
      .row.q-py-sm(v-if="showCircle")
        q-select.full-width(dense v-model="circle" :options="circleArray" hide-bottom-space rounded outlined options-dense bg-color="internal-bg" dropdown-icon="fas fa-chevron-down")
      .row.q-my-md(v-if="filters")
          .h-b2.q-mb-sm {{ chipsFiltersLabel }}
          chips(:tags="filterTags" clickable @click-tag="toggleFilter" )
      .row.items-center.justify-between.q-py-sm(v-if="showViewSelector")
        .h-b2 {{ viewSelectorLabel }}
        .btn-container
          q-btn.q-mr-xxs(
            unelevated
            rounded
            padding="12px"
            size="sm"
            icon="fas fa-th-large"
            :color="view === 'card' ? 'primary' : 'internal-bg'"
            :text-color="view === 'card' ? 'white' : 'primary'"
            @click="view = 'card'"
          )
          q-btn(
            unelevated
            rounded
            padding="12px"
            size="sm"
            icon="fas fa-list"
            :color="view === 'list' ? 'primary' : 'internal-bg'"
            :text-color="view === 'list' ? 'white' : 'primary'"
            @click="view = 'list'"
          )
      .row.items-center.justify-between.q-mt-sm(v-if="showToggle")
        .h-b2 {{ toggleLabel }}
        q-toggle(v-model="toggle" color="primary" keep-color)
      template(v-if="$q.screen.lt.md")
        q-btn.q-my-sm.q-px-sm.full-width(
          :class="'btn-primary-active'"
          label="Save filters"
          no-caps
          rounded
          unelevated
          @click="$emit('close-window')"
        )
        q-btn.q-px-sm.full-width(
          :class="'internal-bg'"
          label="Reset filters"
          no-caps
          rounded
          unelevated
          @click="resetFilters"
        )
</template>

<style lang="stylus" scoped>
.text-filter
  height 40px
  :first-child
    border-radius 15px
    height 40px
.q-select
  height 40px
  :first-child
    height 40px
.q-field >>> span
    font-size 13px
    text-overflow ellipsis
    white-space nowrap
    padding-right 10px
    height 30px !important
    display flex
    align-items center
</style>
