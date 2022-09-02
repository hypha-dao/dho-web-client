<script>
import { validation } from '~/mixins/validation'
// import { isURL } from 'validator'
import { toHTML, toMarkdown } from '~/utils/turndown'

const TITLE_MAX_LENGTH = 50
const DESCRIPTION_MAX_LENGTH = 2000

export default {
  name: 'step-description',
  mixins: [validation],
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    InfoTooltip: () => import('~/components/common/info-tooltip.vue'),
    InputField: () => import('~/components/common/input-field.vue'),
    InputEditor: () => import('~/components/common/input-editor.vue')
  },
  data () {
    return {
      TITLE_MAX_LENGTH: TITLE_MAX_LENGTH,
      DESCRIPTION_MAX_LENGTH: DESCRIPTION_MAX_LENGTH
    }
  },
  props: {
    fields: Object
  },

  computed: {
    nextDisabled () {
      if (this.title.length > 0 && this.title.length <= TITLE_MAX_LENGTH) {
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
        return toHTML(this.$store.state.proposals.draft.description) || ''
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
    onNext () {
      this.$store.commit('proposals/setDescription', toMarkdown(this.description))
      this.$emit('next')
    },
    onPaste (evt) {
      // Let inputs do their thing, so we don't break pasting of links.}
      /* if (evt.target.nodeName === 'INPUT') return
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
      */
    }
  }
}
</script>

<template lang="pug">
widget
  .row
    label.h-h4 {{ fields.stepDescriptionTitle ? fields.stepDescriptionTitle.label : 'Describe your proposal' }}
  .row.q-my-sm(v-if="fields.stepDescriptionTitle && fields.stepDescriptionTitle.description")
    .text-body2.text-grey-7 {{ fields.stepDescriptionTitle.description }}

  .row.q-col-gutter-sm.q-mt-sm
    .col(v-if="fields.title")
      label.h-label {{ fields.title.label }}
      input-field.q-mt-xs.rounded-border(
        :placeholder="fields.title.placeholder"
        :rules="[val => !!val || 'Title is required', val => (val.length <= TITLE_MAX_LENGTH) || `Proposal title length has to be less or equal to ${TITLE_MAX_LENGTH} characters (your title contain ${title.length} characters)`]"
        dense
        outlined
        v-model="title"
      )
    .col(v-if="fields.badgeRestriction")
      label.h-label {{ fields.badgeRestriction.label }}
      q-icon.q-ml-xxs(size="1rem" name="fas fa-info-circle")
        q-tooltip Maximum amount of periods a badge holder can apply for
      input-field.q-mt-xs.rounded-border(
        :rules="[rules.positiveAmount]"
        outlined
        dense
        lazy-rules="ondemand"
        v-model="badgeRestriction"
      )
  .col(v-if="fields.description").q-mt-md
    label.h-label {{ fields.description.label }}
        q-field.full-width.q-mt-xs.rounded-border(
          dense
          maxlength="2000"
          outlined
          ref="bio"
          stack-label
          v-model="description"
        )
          input-editor.full-width(
            :placeholder="fields.description.placeholder"
            :toolbar="[['bold', 'italic', /*'strike', 'underline'*/],['token', 'hr', 'link', 'custom_btn'],['quote', 'unordered', 'ordered']]"
            @paste="onPaste"
            flat
            ref="editorRef"
            v-model="description"
          )

  .col(v-if="fields.url").q-mt-md
    label.h-label {{ fields.url.label }}
    //- input-field.q-mt-xs.rounded-border(
    //-   dense
    //-   :placeholder="fields.url.placeholder"
    //-   :rules="[rules.url]"
    //-   lazy-rules="ondemand"
    //-   v-model="url" outlined
    //- )
    input-file-ipfs(
      label="IPFS File"
      @uploadedFile="ipfsId => url = ipfsId"
    )

  nav.row.justify-end.q-mt-xl.q-gutter-xs
    q-btn.q-px-xl(
      @click="$emit('prev')"
      color="primary"
      label="Previous step"
      no-caps
      outline
      rounded
      unelevated
    )
    q-btn.q-px-xl(
      :disable="nextDisabled"
      @click="onNext"
      color="primary"
      label="Next step"
      no-caps
      rounded
      unelevated
    )

</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px

/deep/.q-field__control-container
  padding: 1px !important;
</style>
