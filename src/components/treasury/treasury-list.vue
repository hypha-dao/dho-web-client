<template lang="pug">
widget.q-mr-sm
  .row.q-px-xl(v-if="columns")
    .col(v-for="column in columns" :key="column.name").flex(:class="align(column.align)")
      .h-btn1.text-heading {{ column.label }}
        span.q-ml-xxs.h-th-subtitle(v-if="column.subtitle") {{ column.subtitle }}
  .row.q-mt-xl
    template(v-if="paginatedTreasury && paginatedTreasury.length > 0")
      treasury-item(v-for="treasuryItem of paginatedTreasury" v-bind="treasuryItem" :key="treasuryItem.id")
    template(v-else-if="loading")
      .flex.justify-center.full-width
        q-spinner-dots(color="primary" size="50px")
  .row.justify-between.q-mt-lg
    q-btn(@click="onPrev" :disable="page === 1" round unelevated class="round-circle" icon="fas fa-chevron-left" color="inherit" text-color="primary" size="md" :ripple="false")
    .q-pt-sm {{ getPaginationText }}
    q-btn(@click="onLoad" :disable="isLastPage" round unelevated class="round-circle" icon="fas fa-chevron-right" color="inherit" text-color="primary" size="md" :ripple="false")
</template>

<script>

export default {
  name: 'treasury-list',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    TreasuryItem: () => import('./treasury-item.vue')
  },
  data () {
    return {
      page: 1
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    treasury: {
      type: Array,
      default: () => []
    },
    size: {
      type: Number,
      default: null
    },
    elements: {
      type: Number,
      default: 10
    },
    loading: {
      type: Boolean
    }
  },
  methods: {
    align (align) {
      const alignment = {}
      if (align === 'left') {
        alignment['justify-start'] = true
        return alignment
      }
      alignment[`justify-${align}`] = align
      return alignment
    },
    onPrev () {
      this.page--
    },
    onLoad () {
      if (this.isLastPage) return
      this.$emit('load')
      this.page++
    }
  },
  computed: {
    pages () {
      return Math.ceil(this.size / this.elements)
    },
    paginatedTreasury () {
      return this.treasury.slice((this.page - 1) * this.elements, this.page * this.elements)
    },
    getPaginationText () {
      if (this.pages === 0) return ''
      return `${this.page} - ${this.page * this.elements} of ${this.pages}`
    },
    isLastPage () {
      if (this.pages === 0) return true
      return this.page === this.pages
    }
  }
}
</script>

<style lang="stylus">

</style>
