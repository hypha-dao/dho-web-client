<script>
import { mapGetters, mapMutations } from 'vuex'
import MarkdownDisplay from '~/components/form/markdown-display'
import RawDisplayIcon from '~/components/documents-parts/raw-display-icon'
import LunarCyclesDisplay from '~/components/documents-parts/lunar-cycles-display'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'

export default {
  name: 'role-view',
  mixins: [documents, format],
  components: { LunarCyclesDisplay, MarkdownDisplay, RawDisplayIcon },
  props: {
    role: { type: Object }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    title () {
      return this.getValue(this.role, 'details', 'title')
    },
    description () {
      return this.getValue(this.role, 'details', 'description')
    },
    url () {
      return this.getValue(this.role, 'details', 'url')
    },
    minDeferred () {
      return this.getValue(this.role, 'details', 'min_deferred_x100')
    },
    usdEquity () {
      return this.getValue(this.role, 'details', 'annual_usd_salary')
    },
    ftCapacity () {
      return this.getValue(this.role, 'details', 'fulltime_capacity_x100') / 100
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md
    | {{ title }}
    raw-display-icon(:document="role")
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
    q-btn.absolute-bottom-right.q-ma-xs(
      v-if="url"
      color="grey-8"
      flat
      dense
      icon="fas fa-link"
      @click="() => openUrl(url)"
      size="sm"
    )
  fieldset.q-mt-sm(v-if="url")
    legend Supporting documentation
    a.link.q-my-md(:href="url" target="_blank") {{ url | truncate(60) }}
  fieldset.q-mt-sm
    legend Salary
    p Fields below display the minimum % commitment and % HYPHA tokens vs. HUSD tokens required for this role as well as the role capacity (how many people can be assigned to this role) and USD equivalent.
    .row.q-col-gutter-xs
      .col-4(:style="{width:'33%'}")
        q-input.bg-grey-4.text-black(
          v-model="minDeferred"
          outlined
          dense
          readonly
        )
        .hint Min. hypha
      .col-4(:style="{width:'27%'}")
        q-input.bg-grey-4.text-black(
          v-model="ftCapacity"
          outlined
          dense
          readonly
        )
        .hint ROLE CAP
      .col-4(:style="{width:'40%'}")
        q-input.bg-grey-4.text-black(
          v-model="usdEquity"
          outlined
          dense
          readonly
        )
        .hint Usd equivalent/year
  .row.flex.justify-between.q-mt-md
    q-btn(
      label="Close"
      rounded
      color="grey"
      unelevated
      @click="hide"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
.link
  color black
  display block
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
</style>
