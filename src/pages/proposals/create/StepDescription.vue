<script>
import { validation } from '~/mixins/validation'
import { isURL } from 'validator'
export default {
  name: 'step-description',
  mixins: [validation],
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    fields: Object
  },

  data () {
    return {
      toolbar: [
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'underline', 'strike'],
        ['undo', 'redo']
      ]
    }
  },

  computed: {
    isDisableNext () {
      if (this.title.length > 0 && this.description.length <= 2000) {
        if (this.url && isURL(this.url, { require_protocol: true })) {
          return false
        } else if (this.url && !isURL(this.url, { require_protocol: true })) {
          return true
        }
        return false
      }
      return true
    },
    title: {
      get () {
        return this.$store.state.proposals.draft.title || ''
      },

      set (value) {
        this.$store.commit('proposals/setTitle', value)
      }
    },

    description: {
      get () {
        return this.$store.state.proposals.draft.description || ''
      },

      set (value) {
        this.$store.commit('proposals/setDescription', value)
      }
    },

    url: {
      get () {
        return this.$store.state.proposals.draft.url || ''
      },

      set (value) {
        this.$store.commit('proposals/setUrl', value)
      }
    },

    badgeRestriction: {
      get () {
        return this.$store.state.proposals.draft.badgeRestriction || 0
      },

      set (value) {
        this.$store.commit('proposals/setBadgeRestriction', value)
      }
    }
  }
}
</script>

<template lang="pug">
widget
  .row
    .text-h5.text-bold {{ fields.stepDescriptionTitle ? fields.stepDescriptionTitle.label : 'Describe your proposal' }}
  .row.q-my-sm
    .text-body2.text-grey-7(v-if="fields.stepDescriptionTitle && fields.stepDescriptionTitle.description") {{ fields.stepDescriptionTitle.description }}
  .q-mt-md
  .row.q-col-gutter-sm
    .col(v-if="fields.title")
      .q-mb-lg
        .text-h6 {{ fields.title.label }}
        q-input.q-my-sm.rounded-border(
          v-model="title"
          outlined
          lazy-rules
          :placeholder="fields.title.placeholder"
          :rules="[val => !!val || 'Title is required', rules.maxLength(50)]"
        )
    .col(v-if="fields.badgeRestriction")
      .q-mb-lg
        .text-h6 {{ fields.badgeRestriction.label }}
        q-input.q-my-sm.rounded-border(
          v-model="badgeRestriction"
          outlined
          lazy-rules
          :rules="[rules.positiveAmount]"
        )
  .q-mb-lg(v-if="fields.description")
    .text-h6 {{ fields.description.label }}
    q-editor.q-my-sm(
        v-model="description"
        min-height="100px"
        :toolbar="toolbar"
        :placeholder="fields.description.placeholder"
      )
    .text-negative.h-b2.q-ml-xs(v-if="description.length >= 2000") The description must contain less than 2,000 characters (your description contain {{description.length}} characters)
  .q-mb-lg(v-if="fields.url")
    .text-h6 {{ fields.url.label }}
    q-input.q-my-sm.rounded-border(
      v-model="url" outlined
      :placeholder="fields.url.placeholder"
      :rules="[rules.url]"
    )
  .next-step.q-py-md
    .row.justify-between
      .nothing
      .buttons
        q-btn.q-px-md.q-mr-md(no-caps rounded flat color="primary" label="Prev step" @click="$emit('prev')")
        q-btn.q-px-md(no-caps rounded :disable="isDisableNext" color="primary" label="Next step" @click="$emit('next')")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
