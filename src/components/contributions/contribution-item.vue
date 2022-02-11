<script>
export default {
  name: 'contribution-item',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    Salary: () => import('~/components/assignments/salary.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    ContributionHeader: () => import('./contribution-header.vue')
  },

  props: {
    contribution: {
      type: Object,
      default: () => {}
    },
    owner: Boolean,
    expandable: Boolean
  },

  data () {
    return {
      expanded: false,
      claiming: false
    }
  },

  computed: {
  },

  methods: {
    onClaimAll () {

    },
    onClick () {
      if (this.owner) {
        if (this.expandable) {
          this.expanded = !this.expanded
        }
        this.$emit('onClick')
      }
    }
  }
}
</script>

<template lang="pug">
widget(background="grey-3" noPadding :class="{ 'cursor-pointer': owner }" @click.native="onClick()").relative-position
  contribution-header.q-px-lg(
    v-bind="contribution"
    :claiming="claiming"
    :expanded="expanded"
    :owner="owner"
    :show-buttons="owner"
    @claim-all="onClaimAll"
  )
  q-slide-transition
    div(v-show="expanded")
      .col-12.q-my-md.q-px-sm(:class="{'q-px-md': $q.screen.gt.xs }")
        salary(
          :owner="owner"
          :tokens="contribution.tokens"
        )
  .row.justify-center(v-if="owner && expandable")
    q-icon.expand-icon(:name="'fas fa-chevron-down' + (expanded ? ' fa-rotate-180' : '')" color="grey-7")
  .q-mb-md
</template>

<style lang="stylus" scoped>
.expand-icon
  margin-top 16px
  margin-bottom -12px
  transition transform 0.5s
</style>
