<script>
import { mapGetters } from 'vuex'
export default {
  name: 'step-proposal-type',
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    OptionsArchetypes: () => import('./OptionsArchetypes.vue'),
    OptionsAssignments: () => import('./OptionsAssignments.vue'),
    OptionsBadges: () => import('./OptionsBadges.vue'),
    OptionsDrafts: () => import('./OptionsDrafts.vue'),
    // OptionsQuests: () => import('./OptionsQuests.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue')
  },

  props: {
    config: Object,
    drafts: Array,
    selection: String,
    reference: Object,
    isMobile: Boolean,
    stepIndex: Number,
    steps: Array,
    currentStepName: String
  },

  computed: {
    ...mapGetters('dao', ['daoSettings']),
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
      if (this.$q.screen.gt.md) {
        switch (option) {
          case 'contribution':
            this.$emit('next')
            break
          case 'archetype':
            this.$emit('next')
            break
          case 'obadge':
            this.$emit('next')
            break
        }
      }
    },

    referenceObject (obj) {
      this.$emit('refer', obj)
      this.$emit('next')
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
  widget(:class="{ 'disable-step': currentStepName !== 'step-proposal-type' && $q.screen.gt.md }")
    .top-options
      .h-h4 Choose an option
      template(v-if="$q.screen.lt.md || $q.screen.md")
        .q-mt-md.row
          template(v-for="opts in Object.values(config.options)")
            div.q-pb-md(v-if="!opts.invisible" :class="{ 'col-6 q-px-xs':$q.screen.sm }")
              button-radio.full-height.q-py-xs.q-px-xs.q-mb-xs(
                :description="opts.description"
                :disable="opts.disable || (opts.needCashClaims && !daoSettings.cashClaimsEnabled)"
                :icon="opts.icon"
                :selected="isSelected(opts.key)"
                :title="opts.title"
                @click="selectOption(opts.key)"
                minHeight
              )
      template(v-if="$q.screen.gt.md")
        .row.items-stretch.q-col-gutter-xs.q-my-xs
          template(v-for="opts in Object.values(config.options)")
            .col-4(v-if="!opts.invisible")
              button-radio.full-height.q-py-xs.q-px-xs(
                :description="opts.description"
                :disable="opts.disable || (opts.needCashClaims && !daoSettings.cashClaimsEnabled)"
                :icon="opts.icon"
                :selected="isSelected(opts.key)"
                :title="opts.title"
                @click="selectOption(opts.key)"
                minHeight
              )
    q-slide-transition
      .sub-options(v-if="subOptions")
        .h-h4.q-py-sm.q-mt-sm Choose a proposal type
        template(v-if="$q.screen.gt.md")
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
        template(v-if="$q.screen.lt.md || $q.screen.md")
          .q.mt-md.row
            template(v-for="opts in Object.values(subOptions)")
              div.q-pb-md(:class="{ 'col-6 q-px-xs':$q.screen.sm }")
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
  template(v-if="$q.screen.lt.md || $q.screen.md")
    q-card(:style="'border-radius: 25px; box-shadow: none; z-index: 7000; position: fixed; bottom: -20px; left: 0; right: 0; box-shadow: 0px 0px 26px 0px rgba(0, 0, 41, 0.2);'")
      creation-stepper(
        :activeStepIndex="stepIndex"
        :steps="steps"
        :nextDisabled="nextDisabled"
        @publish="$emit('publish')"
        @save="$emit('save')"
        @next="$emit('next')"
      )
</template>

<style lang="stylus" scoped>
.disable-step
  opacity: 20% !important
  pointer-events: none
  border-radius: 26px
</style>
