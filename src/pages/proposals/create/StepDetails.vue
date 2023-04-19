<script>
import { mapGetters } from 'vuex'
import { PROPOSAL_TYPE } from '~/const'
import { validation } from '~/mixins/validation'
import { toHTML, toMarkdown } from '~/utils/turndown'

// TODO: Refactor to boot
import Vue from 'vue'
import VueSanitize from 'vue-sanitize'
Vue.use(VueSanitize)

const TITLE_MAX_LENGTH = 50
const DESCRIPTION_MAX_LENGTH = 4000

export default {
  name: 'step-details',
  mixins: [validation],
  components: {
    InputEditor: () => import('~/components/common/input-editor.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    disablePrevButton: Boolean,
    fields: Object,
    stepIndex: Number,
    steps: Array
  },

  apollo: {
    circles: {
      query: require('~/query/circles/dao-circle-list.gql'),
      update: data => data.getDao.circles.map(circle => ({
        label: circle.name,
        value: circle.id
      })),
      skip () { return !this.selectedDao?.docId || !this.fields.circle },
      variables () { return { daoId: this.selectedDao.docId } }
    }
  },

  data () {
    return {
      PROPOSAL_TYPE,
      TITLE_MAX_LENGTH,
      DESCRIPTION_MAX_LENGTH
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),
    sanitizeDescription () { return this.$sanitize(this.description, { allowedTags: [] }) },

    canGoNext () {
      if (this.$store.state.proposals.draft.edit) {
        if (this.sanitizeDescription.length < DESCRIPTION_MAX_LENGTH) {
          if (this.fields.purpose && this.purpose.length === 0) {
            return true
          }
          return false
        }
      } else if (this.sanitizeDescription.length > 0 && this.title.length > 0 && this.sanitizeDescription.length < DESCRIPTION_MAX_LENGTH && this.title.length <= TITLE_MAX_LENGTH) {
        if (this.fields.purpose && this.purpose.length === 0) {
          return true
        }
        return false
      }
      return true
    },

    title: {
      get () { return this.$store.state.proposals.draft.title || '' },
      set (value) { this.$store.commit('proposals/setTitle', value) }
    },
    description: {
      get () { return toHTML(this.$store.state.proposals.draft.description) || '' },
      set (value) { this.$store.commit('proposals/setDescription', value) }
    },
    circle: {
      get () { return this.$store.state.proposals.draft.circle || '' },
      set (value) { this.$store.commit('proposals/setCircle', value) }
    },
    url: {
      get () { return this.$store.state.proposals.draft.url || '' },
      set (value) { this.$store.commit('proposals/setUrl', value) }
    }
  },

  methods: {
    onNext () {
      this.$store.commit('proposals/setDescription', toMarkdown(this.description))
      this.$emit('next')
    }
  }
}
</script>

<template lang="pug">
widget
  header
    h3.h-h3.q-pa-none.q-ma-none {{ fields.stepDescriptionTitle ? fields.stepDescriptionTitle.label : '' }}
    .text-body2.text-grey-7.q-my-sm(v-if="fields.stepDescriptionTitle && fields.stepDescriptionTitle.description") {{ fields.stepDescriptionTitle.description }}

  section.q-mt-xl
    .col.q-mt-sm(v-if="fields.title")
      label.h-label {{ fields.title.label }}
      q-input.q-mt-xs.rounded-border(
        :disable="$store.state.proposals.draft.edit"
        :placeholder="fields.title.placeholder"
        :rules="[val => !!val || 'Title is required', val => (val.length <= TITLE_MAX_LENGTH) || `Proposal title length has to be less or equal to ${TITLE_MAX_LENGTH} characters (your title contain ${title.length} characters)`]"
        dense
        outlined
        v-model="title"
      )

    .col.q-mt-sm(v-if="fields.description")
      label.h-label {{ fields.description.label }}
      q-field.q-mt-xs.rounded-border(
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
          flat
          ref="editorRef"
          v-model="description"
        )

    .col.q-mt-sm(v-if="fields.circle")
      label.h-label {{ fields.circle.label }}
      q-select.q-mt-xs.q-pb-md(
        :option-label="(option) => option.label"
        :option-value="option => option"
        :options="circles"
        dense
        dropdown-icon="fas fa-chevron-down"
        hide-bottom-space
        options-dense
        outlined
        rounded
        v-model="circle"
      )

    .col.q-mt-sm(v-if="fields.url")
      label.h-label {{ fields.url.label }}
      .col.q-pb-md
        q-btn.q-px-xl.rounded-border.text-bold.q-mt-xs(
          @click="$refs.url.chooseFile()"
          color="primary"
          label="Upload attachments (max 3MB)"
          no-caps
          outline
          rounded
          unelevated
        )
        input-file-ipfs(
          @uploadedFile="url = arguments[0]"
          image
          ref="url"
          v-show="false"
        )

  nav(v-if="$q.screen.gt.md").q-mt-xl.row.justify-end.q-gutter-xs
    q-btn.q-px-xl(
      @click="$emit('prev')"
      color="primary"
      flat
      label="Back"
      no-caps
      outline
      rounded
      v-if="!disablePrevButton"
    )
    q-btn.q-px-xl(
      :disable="canGoNext"
      @click="onNext"
      color="primary"
      label="Next step"
      no-caps
      rounded
      unelevated
    )

</template>

<style lang="stylus" scoped>
</style>
