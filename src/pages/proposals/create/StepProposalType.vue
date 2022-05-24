<script>
export default {
  name: 'step-proposal-type',
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    OptionsArchetypes: () => import('./OptionsArchetypes.vue'),
    OptionsAssignments: () => import('./OptionsAssignments.vue'),
    OptionsBadges: () => import('./OptionsBadges.vue'),
    OptionsDrafts: () => import('./OptionsDrafts.vue'),
    // OptionsQuests: () => import('./OptionsQuests.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    config: Object,
    drafts: Array,
    selection: String,
    reference: Object
  },

  computed: {
    nextDisabled () {
      if (this.selection) {
        // JUST MVP
        // This validation is temporal just for mvp
        if (this.selection === 'contribution') {
          return false
        }
        if (this.config.options[this.selection]) {
          return true
        }

        let result = null
        let found = false
        Object.values(this.config.options).forEach((opt) => {
          if (!found && opt.options[this.selection]) {
            result = opt.options[this.selection]
            found = true
          }
        })

        return !(this.reference || result.options === undefined)
      }

      return true
    },

    subOptions () {
      let result = null
      if (this.selection) {
        // Check if the selection is a top level option
        if (this.config.options[this.selection]) {
          const sOptions = this.config.options[this.selection].options || undefined
          for (const key in sOptions) {
            // eslint-disable-next-line no-prototype-builtins
            if (sOptions.hasOwnProperty(key)) {
              return sOptions
            }
          }
          return undefined
        }

        // Check if the selection is a second level option
        let found = false
        Object.values(this.config.options).forEach((opt) => {
          if (!found && opt.options[this.selection]) {
            result = opt.options
            found = true
          }
        })
      }

      return result
    },

    referenceComponent () {
      let result = null
      if (this.selection) {
        let found = false
        Object.values(this.config.options).forEach((opt) => {
          if (!found) {
            if (opt.key === this.selection) return null

            if (opt.options[this.selection]) {
              result = opt.options[this.selection].options
              found = true
            }
          }
        })
      }

      return result
    }
  },

  methods: {
    selectOption (option) {
      this.$emit('select', option)
    },

    referenceObject (obj) {
      this.$emit('refer', obj)
    },

    isSelected (option) {
      if (this.selection) {
        // Check if this option is selected directly
        if (option === this.selection) return true

        // Check if this option is the parent of the selection
        if (this.config.options[option]) {
          if (this.config.options[option].options[this.selection]) {
            return true
          }
        }
      }

      return false
    }
  }
}
</script>

<template lang="pug">
.step-proposal-type
  widget.q-mb-md(v-if="drafts && drafts.length > 0")
    .text-h6.q-pa-sm Complete your draft proposal
    TransitionGroup(:duration="400"  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
      options-drafts.q-my-sm(
        :draft="draft"
        :key="draft.draftId"
        @continue="draft => $emit('continue', draft)"
        @delete="draft => $emit('delete', draft)"
        v-for="draft in drafts"
      )

  widget
    .top-options
      .h-h4 Choose an option
      .row.items-stretch.q-col-gutter-xs.q-my-xs
        template(v-for="opts in Object.values(config.options)")
          .col-4
            button-radio.full-height.q-py-xs.q-px-xs(
              :description="opts.description"
              :disable="opts.disable"
              :icon="opts.icon"
              :selected="isSelected(opts.key)"
              :title="opts.title"
              @click="selectOption(opts.key)"
              minHeight
            )
    q-slide-transition
      .sub-options(v-if="subOptions")
        .h-h4.q-py-sm.q-mt-sm Choose a proposal type
        .row.items-stretch
          template(v-for="opts in Object.values(subOptions)")
            .col-4.q-pr-sm.q-pb-sm
              button-radio.full-height.q-py-xs.q-px-xs(
                :description="opts.description"
                :disable="opts.disable"
                :icon="opts.icon"
                :selected="isSelected(opts.key)"
                :title="opts.title"
                @click="selectOption(opts.key)"
                minHeight
              )
    q-slide-transition
      .leaf-options(v-if="referenceComponent")
        component(
          :is="`options-${referenceComponent}`"
          :reference="reference"
          @select="referenceObject"
        )
    .next-step.q-py-md
      .row.justify-between
        .nothing
        nav.row.justify-end.q-mt-xl.q-gutter-xs
          q-btn.q-px-xl(
            :class="nextDisabled? 'btn-primary-disabled': 'btn-primary-active'"
            :disable="nextDisabled"
            @click="$emit('next')"
            color="primary"
            label="Next step"
            no-caps
            rounded
            unelevated
          )
</template>
