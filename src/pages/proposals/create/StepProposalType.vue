<script>
import { mapGetters } from 'vuex'
import { MEMBER_TYPE } from '~/const'

export default {
  name: 'step-proposal-type',
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    OptionsArchetypes: () => import('./OptionsArchetypes.vue'),
    OptionsAssignments: () => import('./OptionsAssignments.vue'),
    OptionsBadges: () => import('./OptionsBadges.vue'),
    OptionsDrafts: () => import('./OptionsDrafts.vue'),
    OptionsQuests: () => import('./OptionsQuests.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    config: Object,
    drafts: Array,
    selection: String,
    reference: Object,
    isMobile: Boolean,
    stepIndex: Number,
    steps: Array,
    currentStepName: String,
    memberType: String
  },

  data () {
    return {
      MEMBER_TYPE
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings']),
    nextDisabled () {
      const options = this.memberType === MEMBER_TYPE.COMMUNITY ? this.config.types.community.options : this.memberType === MEMBER_TYPE.CORE ? this.config.types.core.options : this.config.options
      if (this.selection) {
        // JUST MVP
        // This validation is temporal just for mvp
        if (this.selection === 'contribution') {
          return false
        }
        if (options[this.selection]) {
          return true
        }

        let result = null
        let found = false
        Object.values(options).forEach((opt) => {
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
      const options = this.memberType === MEMBER_TYPE.COMMUNITY ? this.config.types.community.options : this.memberType === MEMBER_TYPE.CORE ? this.config.types.core.options : this.config.options
      if (this.selection) {
        // Check if the selection is a top level option
        if (options[this.selection]) {
          const sOptions = options[this.selection].options || undefined
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
        Object.values(options).forEach((opt) => {
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
      const options = this.memberType === MEMBER_TYPE.COMMUNITY ? this.config.types.community.options : this.memberType === MEMBER_TYPE.CORE ? this.config.types.core.options : this.config.options
      if (this.selection) {
        let found = false
        Object.values(options).forEach((opt) => {
          if (!found) {
            if (this.selection === opt.key) {
              if (opt.options && typeof (opt.options) === 'string') {
                result = opt.options
                found = true
              }
            } else {
              if (opt.key === this.selection) return null
              if (opt.options[this.selection]) {
                result = opt.options[this.selection].options
                found = true
              }
            }
          }
        })
      }
      return result
    },

    type () { return this.selection ? this.selection.toUpperCase() : null },

    isApplying () { return ['apply', 'badge', 'assignment', 'quest'].map(_ => _.toUpperCase()).includes(this.type) }
  },

  methods: {
    selectOption (option) {
      this.$emit('select', option)
      if (this.$q.screen.gt.md) {
        const exeptions = ['quest', 'badge', 'assignment', 'apply', 'create']
        if (!exeptions.includes(option)) {
          this.$emit('next')
        }
      }
    },

    referenceObject (obj) {
      this.$emit('refer', obj)
      this.$emit('next')
    },

    isSelected (option) {
      const options = this.memberType === MEMBER_TYPE.COMMUNITY ? this.config.types.community.options : this.memberType === MEMBER_TYPE.CORE ? this.config.types.core.options : this.config.options
      if (this.selection) {
        // Check if this option is selected directly
        if (option === this.selection) return true

        // Check if this option is the parent of the selection
        if (options[option]) {
          if (options[option].options[this.selection]) {
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
      template(v-if="$q.screen.lt.md || $q.screen.md")
        .row.q-col-gutter-sm
          template(v-for="opts in Object.values(this.memberType === MEMBER_TYPE.COMMUNITY ? this.config.types.community.options : this.memberType === MEMBER_TYPE.CORE ? this.config.types.core.options : this.config.options)")
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
        .row.items-stretch.q-col-gutter-sm
          template(v-for="opts in Object.values(this.memberType === MEMBER_TYPE.COMMUNITY ? this.config.types.community.options : this.memberType === MEMBER_TYPE.CORE ? this.config.types.core.options : this.config.options)")
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
    q-slide-transition(v-if="memberType === MEMBER_TYPE.CORE")
      .sub-options(v-if="subOptions")
        .h-h4.q-py-xl.q-mt-xl {{ isApplying ? 'Assignment' : 'Assets'}}
        template(v-if="$q.screen.gt.md")
          .row.items-stretch.q-col-gutter-sm
            template(v-for="opts in Object.values(subOptions)")
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
          @changeOption="selectOption"
        )

</template>

<style lang="stylus" scoped>
</style>
