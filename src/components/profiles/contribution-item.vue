<script>
export default {
  name: 'contribution-item',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    Salary: () => import('~/components/assignments/salary.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    contribution: {
      type: Object,
      default: () => {}
    },
    owner: Boolean
  },

  data () {
    return {
      expanded: false
    }
  },

  computed: {
    caption () {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      // const usdAmount = this.contribution.usdEquivalent ? `$${this.contribution.usdEquivalent} USD Equiv. | ` : ''
      return `${this.contribution.created.toLocaleDateString(undefined, options)}`
    },

    tags () {
      return [
        {
          label: 'Contribution',
          color: 'warning',
          text: 'white'
        }
      ]
    }
  },

  methods: {
    onClick () {
      if (this.owner) {
        this.expanded = !this.expanded
      }
    }
  }
}
</script>

<template lang="pug">
widget(shadow noPadding :class="{ 'cursor-pointer': owner }" @click.native="onClick()").relative-position
  .full-width.q-px-sm(:class="{'q-px-md': $q.screen.gt.xs }")
    .row.full-width.items-center.justify-between
      .col-12.col-md-8
        chips(:tags="tags")
        .q-ma-sm
          .text-bold(:style="{ 'font-size': '1.25em' }") {{ contribution.title }}
          .text-caption {{ caption }}
  q-slide-transition
    div(v-show="expanded")
      .col-12.q-my-md.q-px-sm(:class="{'q-px-md': $q.screen.gt.xs }")
        salary(
          :owner="owner"
          :tokens="contribution.tokens"
        )
  .row.justify-center(v-if="owner")
    q-icon.expand-icon(:name="'fas fa-chevron-down' + (expanded ? ' fa-rotate-180' : '')" color="grey-7")
</template>

<style lang="stylus" scoped>
.expand-icon
  margin-top 16px
  margin-bottom -12px
  transition transform 0.5s
</style>
