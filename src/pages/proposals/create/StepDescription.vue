<script>
import { validation } from '~/mixins/validation'
// import { isURL } from 'validator'
export default {
  name: 'step-description',
  mixins: [validation],
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue')
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
        // if (this.url && isURL(this.url, { require_protocol: true })) {
        //   return false
        // }
        // if (this.url && !isURL(this.url, { require_protocol: true })) {
        //   return true
        // }
        if (this.fields.badgeRestriction && (this.badgeRestriction === 0 || this.badgeRestriction < 0)) {
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
        this.$store.commit('proposals/setBadgeRestriction', parseFloat(value))
      }
    }
  },
  methods: {
    onPaste (evt) {
      // Let inputs do their thing, so we don't break pasting of links.
      if (evt.target.nodeName === 'INPUT') return
      let text, onPasteStripFormattingIEPaste
      evt.preventDefault()
      evt.stopPropagation()
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData('text/plain')
        this.$refs.editorRef.runCmd('insertText', text)
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData('text/plain')
        this.$refs.editorRef.runCmd('insertText', text)
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true
          this.$refs.editorRef.runCmd('ms-pasteTextOnly', text)
        }
        onPasteStripFormattingIEPaste = false
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
          :rules="[rules.positiveAmount, rules.greaterThanOrEqual(1)]"
        )
  .q-mb-lg(v-if="fields.description")
    .text-h6 {{ fields.description.label }}
    q-editor.q-my-sm(
        v-model="description"
        min-height="100px"
        max-height="600px"
        :toolbar="toolbar"
        ref="editorRef"
        :placeholder="fields.description.placeholder"
        @paste="onPaste"
      )
    .text-negative.h-b2.q-ml-xs(v-if="description.length >= 2000") The description must contain less than 2,000 characters (your description contain {{description.length}} characters)
  .q-mb-lg(v-if="fields.url")
    .text-h6 {{ fields.url.label }}
    //- q-input.q-my-sm.rounded-border(
    //-   v-model="url" outlined
    //-   :placeholder="fields.url.placeholder"
    //-   :rules="[rules.url]"
    //- )
    input-file-ipfs(
      label="IPFS File"
      @uploadedFile="ipfsId => url = ipfsId"
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
