<script>
export default {
  name: 'step-proposal-type',
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    OptionsArchetypes: () => import('./OptionsArchetypes.vue'),
    OptionsAssignments: () => import('./OptionsAssignments.vue'),
    OptionsBadges: () => import('./OptionsBadges.vue'),
    OptionsDrafts: () => import('./OptionsDrafts.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    config: Object,
    drafts: Array,
    proposal: Object,
    selection: String
  },

  computed: {
    top () {
      return this.selection.split(':')[0]
    },

    sub () {
      const selects = this.selection.split(':')
      if (selects.length > 1) {
        return selects[1]
      }
      return null
    },

    hash () {
      const selects = this.selection.split(':')
      if (selects.length > 2) {
        return selects[2]
      }
      return null
    }
  },

  methods: {
    doSelection (top, sub, leaf) {
      const subStr = sub ? `:${sub}` : ''
      const leafStr = leaf ? `:${leaf}` : ''
      this.$emit('select', `${top}${subStr}${leafStr}`)
    },

    selectHash (hash) {
      this.doSelection(this.top, this.sub, hash)
    }
  }
}
</script>

<template lang="pug">
.step-proposal-type
  widget.q-mb-md(v-if="drafts.length")
    .text-h6.q-pa-sm Complete your draft proposal
    options-drafts(
      :drafts="drafts"
      @continue="draft => $emit('continue', draft)"
      @delete="draft => $emit('delete', draft)"
    )
  widget
    .top-options
      .text-h6.q-pa-sm Choose an option
      .row
        template(v-for="opts in Object.values(config.options)")
          .col-4.q-pa-sm
            button-radio(
              :icon="opts.icon"
              :selected="top === opts.key"
              :title="opts.title"
              :description="opts.description"
              @click="doSelection(opts.key)"
            )
    q-slide-transition
      .sub-options(v-if="top")
        .text-h6.q-pa-sm Choose a proposal type
        .row
          template(v-for="opts in Object.values(config.options[top].options)")
            .col-4.q-pa-sm
              button-radio(
                :icon="opts.icon"
                :selected="sub === opts.key"
                :title="opts.title"
                :description="opts.description"
                @click="doSelection(top, opts.key)"
              )
    q-slide-transition
      .leaf-options(v-if="sub && config.options[top].options && config.options[top].options[sub]")
        options-archetypes(v-if="config.options[top].options[sub].options === 'archetypes'"
          :selectedHash="hash"
          @select="selectHash")
        options-assignments(v-else-if="config.options[top].options[sub].options === 'assignments'"
          :selectedHash="hash"
          @select="selectHash")
        options-badges(v-else-if="config.options[top].options[sub].options === 'badges'"
          :selectedHash="hash"
          @select="selectHash")
        // options-quests(v-else-if="config.options[top].options[sub].options === 'quests'")
    .next-step.q-py-md
      .row.justify-between
        .nothing
        q-btn.q-px-md(no-caps rounded color="primary" label="Next step" @click="$emit('next')")
</template>
