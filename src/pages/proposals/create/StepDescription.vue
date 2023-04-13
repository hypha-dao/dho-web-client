<script>
import { mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
// import { isURL } from 'validator'
import { toHTML, toMarkdown } from '~/utils/turndown'
import Vue from 'vue'
import VueSanitize from 'vue-sanitize'
Vue.use(VueSanitize)

const TITLE_MAX_LENGTH = 50
const PURPOSE_MAX_LENGTH = 1000
const DESCRIPTION_MAX_LENGTH = 4000

export default {
  name: 'step-description',
  mixins: [validation],
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    InfoTooltip: () => import('~/components/common/info-tooltip.vue'),
    InputEditor: () => import('~/components/common/input-editor.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue')
  },
  props: {
    fields: Object,
    stepIndex: Number,
    steps: Array,
    currentStepName: String,
    disablePrevButton: Boolean,
    type: String
  },

  apollo: {
    circles: {
      query: require('~/query/circles/dao-circle-list.gql'),
      update: data => {
        return data.getDao.circle.map(circle => {
          return {
            label: circle.name,
            value: circle.id
          }
        })
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () { return { daoId: this.selectedDao.docId } }
    }
  },

  data () {
    return {
      TITLE_MAX_LENGTH: TITLE_MAX_LENGTH,
      DESCRIPTION_MAX_LENGTH: DESCRIPTION_MAX_LENGTH,
      PURPOSE_MAX_LENGTH: PURPOSE_MAX_LENGTH,
      policies: [],
      questTypes: []
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),

    nextDisabled () {
      if (this.$store.state.proposals.draft.edit) {
        if (this.sanitizeDescription.length < DESCRIPTION_MAX_LENGTH) {
          if (this.fields.purpose && this.purpose.length === 0) {
            return true
          }
          return false
        }
      } else if (this.sanitizeDescription.length > 0 && this.title.length > 0 && this.sanitizeDescription.length < DESCRIPTION_MAX_LENGTH && this.title.length <= TITLE_MAX_LENGTH) {
        // if (this.url && isURL(this.url, { require_protocol: true })) {
        //   return false
        // }
        // if (this.url && !isURL(this.url, { require_protocol: true })) {
        //   return true
        // }
        if (this.fields.purpose && this.purpose.length === 0) {
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

    purpose: {
      get () {
        return this.$store.state.proposals.draft.purpose || ''
      },

      set (value) {
        this.$store.commit('proposals/setPurpose', value)
      }
    },

    parent: {
      get () {
        return this.$store.state.proposals.draft.parentId
      },

      set (value) {
        this.$store.commit('proposals/setParent', value)
      }
    },

    sanitizeDescription () {
      return this.$sanitize(this.description, { allowedTags: [] })
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
widget(:class="{ 'disable-step': currentStepName !== 'step-description' && $q.screen.gt.md }")
  .col(v-if="fields.questType")
    label.h-h4 {{ fields.questType.label }}
    .text-grey.q-my-md {{ fields.questType.description }}
    .row
      .col
        q-select.disabled-input.full-width.q-mb-md(dense v-model="questType" :options="questTypes" hide-bottom-space rounded outlined options-dense dropdown-icon="fas fa-chevron-down")
      .col
  .row
    label.h-h4 {{ fields.stepDescriptionTitle ? fields.stepDescriptionTitle.label : '' }}
  .row.q-my-sm(v-if="fields.stepDescriptionTitle && fields.stepDescriptionTitle.description")
    .text-body2.text-grey-7 {{ fields.stepDescriptionTitle.description }}
  .row
    .col(v-if="fields.parentCircle").q-mb-md
      label.h-h4 {{ fields.parentCircle.label }}
        q-select.q-mt-xs.full-width(
          :label="fields.parentCircle.placeholder"
          :options="circles"
          :option-label="(option) => option.label"
          :option-value="option => option"
          dense
          dropdown-icon="fas fa-chevron-down"
          hide-bottom-space
          options-dense
          outlined
          rounded
          v-model="parent"
        )
    .col
  .row
    .col(v-if="fields.policyType").q-mb-md
      label.h-h4 {{ fields.policyType.label }}
        q-select.disabled-input.q-mt-xs.full-width(dense v-model="policy" :options="policies" hide-bottom-space rounded outlined options-dense dropdown-icon="fas fa-chevron-down")
    .col
  .q-col-gutter-sm(:class="{ 'row':$q.screen.gt.md }")
    .col(v-if="fields.title")
      label.h-h4 {{ fields.title.label }}
      q-input.q-mt-xs.rounded-border(
        :placeholder="fields.title.placeholder"
        :rules="[val => !!val || 'Title is required', val => (val.length <= TITLE_MAX_LENGTH) || `Proposal title length has to be less or equal to ${TITLE_MAX_LENGTH} characters (your title contain ${title.length} characters)`]"
        dense
        outlined
        v-model="title"
        :disable="$store.state.proposals.draft.edit"
      )
    .col(v-if="fields.purpose")
      label.h-h4 {{ fields.purpose.label }}
      q-input.q-mt-xs.rounded-border(
        :rules="[val => !!val || 'Purpose is required', val => (val.length <= PURPOSE_MAX_LENGTH) || `Badge purpose length has to be less or equal to ${PURPOSE_MAX_LENGTH} characters (your purpose contain ${purpose.length} characters)`]"
        :placeholder="fields.purpose.placeholder"
        outlined
        dense
        v-model="purpose"
      )
  .col(v-if="fields.description").q-mt-md
    label.h-h4 {{ fields.description.label }}
        q-field.full-width.q-mt-xs.rounded-border(
          :rules="[rules.required, val => this.$sanitize(val, { allowedTags: [] }).length < DESCRIPTION_MAX_LENGTH || `The description must contain less than ${DESCRIPTION_MAX_LENGTH} characters (your description contain ${this.$sanitize(description, { allowedTags: [] }).length} characters)`]"
          dense
          maxlength=4000
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
  .row
    .col(v-if="fields.circle")
      label.h-h4 {{ fields.circle.label }}
      q-select.disabled-input.q-mt-xs.full-width(dense v-model="circle" :options="circles" hide-bottom-space rounded outlined options-dense dropdown-icon="fas fa-chevron-down")
    .col
  .col(v-if="fields.url").q-mt-md
    label.h-h4 {{ fields.url.label }}
    //- q-input.q-mt-xs.rounded-border(
    //-   dense
    //-   :placeholder="fields.url.placeholder"
    //-   :rules="[rules.url]"
    //-   lazy-rules="ondemand"
    //-   v-model="url" outlined
    //- )
    input-file-ipfs(
      :cid="url"
      :label="fields.url.placeholder"
      @uploadedFile="ipfsId => url = ipfsId"
    )

  nav(v-if="$q.screen.gt.md").row.justify-end.q-mt-xl.q-gutter-xs
    q-btn.h-btn2.q-px-xl(
      v-if="!disablePrevButton"
      @click="$emit('prev')"
      color="primary"
      label="Back"
      no-caps
      outline
      rounded
      flat
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

/deep/.q-field__control-container
  padding: 1px !important;
.disable-step
  opacity: 20% !important
  pointer-events: none
  border-radius: 26px
.disabled-input
  opacity: 30%
  pointer-events: none
</style>
