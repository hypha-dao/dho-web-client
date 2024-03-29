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
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue'),
    IpfsFileViewer: () => import('~/components/ipfs/ipfs-file-viewer.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue')
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
      update: data => data.queryCircle.map(circle => ({
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
      DESCRIPTION_MAX_LENGTH,
      uploading: false,
      originalUploadedFile: null,
      isDragging: false,
      files: []
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),
    ...mapGetters('accounts', ['memberType']),
    sanitizeDescription () { return this.$sanitize(this.description, { allowedTags: [] }) },

    canGoNext () {
      return [
        this.title !== '',
        this.description !== '',
        this.sanitizeDescription !== '',
        DESCRIPTION_MAX_LENGTH >= this.sanitizeDescription.length
      ].every(_ => _)
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
    },
    votingMethod: {
      get () { return this.$store.state.proposals.draft.votingMethod || '' },
      set (value) { this.$store.commit('proposals/setVotingMethod', value) }
    },

    isEditing () { return this.$store.state.proposals.draft.edit }
  },

  created () {
    this.votingMethod = this.memberType
    if (this.$store.state.proposals.draft.type === PROPOSAL_TYPE.ABILITY) {
      this.title = this.$store.state.proposals?.draft?.badge?.details_title_s
    }
  },

  methods: {
    onNext () {
      this.$store.commit('proposals/setDescription', toMarkdown(this.description))
      this.$emit('next')
    },
    isProposalType (type) {
      return this.$store.state.proposals.draft.type === type
    },
    fileIsImage() {
      return ['jpeg', 'jpg', 'svg', 'png', 'webp'].some(v => this.url.includes(v))
    },
    fileIsVideo() {
      return ['mp4', 'mov'].some(v => this.url.includes(v))
    },
    fileIsDoc() {
      return ['txt', 'pdf', 'doc'].some(v => this.url.includes(v))
    },
    byteToKB (byte) {
      return Math.round(byte / 1000)
    },
    onChange(e) {
      this.$refs.url.updateModel(e)
    },
    dragover(e) {
      e.preventDefault()
      this.isDragging = true
    },
    dragleave() {
      this.isDragging = false
    },
    drop(e) {
      e.preventDefault()
      this.$refs.file.files = e.dataTransfer.files
      this.onChange(this.$refs.file.files[0])
      this.isDragging = false
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
      q-input.q-mt-xs.rounded-border(:disable="isEditing || isProposalType(PROPOSAL_TYPE.ABILITY) || isProposalType(PROPOSAL_TYPE.ASSIGNBADGE)" :placeholder="fields.title.placeholder" :rules="[val => !!val || $t('pages.proposals.create.stepdetails.titleIsRequired'), val => (val.length <= TITLE_MAX_LENGTH) || $t('pages.proposals.create.stepdetails.proposalTitleLengthHasToBeLess', { TITLE_MAX_LENGTH: TITLE_MAX_LENGTH, length: title.length })]" dense outlined v-model="title")
    .col.q-mt-sm(v-if="fields.description")
      label.h-label {{ fields.description.label }}
      q-field.q-mt-xs.rounded-border(
        :rules="[rules.required, val => this.$sanitize(val, { allowedTags: [] }).length < DESCRIPTION_MAX_LENGTH || $t('pages.proposals.create.stepdetails.theDescriptionMustContainLess', { DESCRIPTION_MAX_LENGTH: DESCRIPTION_MAX_LENGTH, length: this.$sanitize(description, { allowedTags: [] }).length })]"
        dense
        maxlength="4000"
        outlined
        ref="description"
        stack-label
        v-model="description"
      )
        input-editor.full-width(:placeholder="fields.description.placeholder" :toolbar="[['bold', 'italic', /*'strike', 'underline'*/],['token', 'hr', 'link', 'custom_btn'],['quote', 'unordered', 'ordered']]" flat ref="editorRef" v-model="description")
    .col.q-mt-sm(v-if="fields.circle")
      label.h-label {{ fields.circle.label }}
      q-select.q-mt-xs.q-pb-md(:option-label="(option) => option.label" :option-value="option => option" :options="circles" dense dropdown-icon="fas fa-chevron-down" hide-bottom-space options-dense outlined rounded v-model="circle")
    .col.q-mt-sm.full-width(v-if="fields.url")
      label.h-label {{ fields.url.label }}
      .row.q-pb-md.q-mt-xxs.q-gutter-md
        .col
          div(:class="{'col': !$q.screen.gt.md, 'row': $q.screen.gt.md}")
            .col-2.q-mr-xs
              .flex.items-center.justify-center.bg-primary(:style="{ 'width': '40px', 'height': '40px', 'border-radius': '50%' }")
                img(src="~/assets/icons/attachments/picture.svg")
            .col-8
              .h-h7(:style="{ 'font-size': '13px' }") {{ $t('pages.proposals.create.stepdetails.images') }}
              .h-b2.text-italic {{ $t('pages.proposals.create.stepdetails.pngJpegInApp') }}
        .col
          div(:class="{'col': !$q.screen.gt.md, 'row': $q.screen.gt.md}")
            .col-2.q-mr-xs
              .flex.items-center.justify-center.bg-primary(:style="{ 'width': '40px', 'height': '40px', 'border-radius': '50%' }")
                img(src="~/assets/icons/attachments/doc.svg")
            .col-8
              .h-h7(:style="{ 'font-size': '13px' }") {{ $t('pages.proposals.create.stepdetails.documents') }}
              .h-b2.text-italic {{ $t('pages.proposals.create.stepdetails.txtPdfDoc') }}
        .col
          div(:class="{'col': !$q.screen.gt.md, 'row': $q.screen.gt.md}")
            .col-2.q-mr-xs
              .flex.items-center.justify-center.bg-primary(:style="{ 'width': '40px', 'height': '40px', 'border-radius': '50%' }")
                img(src="~/assets/icons/attachments/camera.svg")
            .col-8
              .h-h7(:style="{ 'font-size': '13px' }") {{ $t('pages.proposals.create.stepdetails.videos') }}
              .h-b2.text-italic {{ $t('pages.proposals.create.stepdetails.mp4MovMax') }}
      .col.q-pb-md
        input#fileInput.hidden-input(name="file" type="file" ref="file" accept=".jpg,.jpeg,.png,.svg,.webp,.mp4,.mov,.doc,.txt,.pdf")
        .dropzone-container.full-width.flex.items-center.justify-center(@dragover="dragover" @dragleave="dragleave" @drop="drop" @change="onChange" for="fileInput" :style="{ 'min-height': '200px', 'border': '1px dashed #242F5D', 'border-radius': '12px' }")
          .flex.column.justify-center.items-center
            img.q-mb-xs(src="~/assets/icons/attachments/cloud.svg" width="73px")
            template(v-if="isDragging")
              .text-bold.text-primary(:style="{ 'font-size': '13px' }") {{ $t('pages.proposals.create.stepdetails.leaveFileHere') }}
            template(v-else)
              .text-bold.text-primary(:style="{ 'font-size': '13px' }") {{ $t('pages.proposals.create.stepdetails.dragAndDrop') }}
              .text-bold.text-secondary.text-underline.cursor-pointer(@click="$refs.url.chooseFile()" :style="{ 'font-size': '13px' }") {{ $t('pages.proposals.create.stepdetails.orBrowse') }}
      .flex.justify-center.full-width.items-center(v-if="uploading")
        loading-spinner.loadingSpinner(color="primary" size="4rem")
      template(v-else)
        ipfs-image-viewer(v-if="url && fileIsImage()" :ipfsCid="url" showDefault square :originalUploadedFile="originalUploadedFile" canRemoveFile="canRemoveFile" @removeFile="url=''")
        template(v-else-if="url")
          .col(:style="{ 'max-width': '180px', 'border-radius': '12px', 'box-shadow': '0px 0px 14px #23283C14' }")
            .row.bg-grey.flex.items-center.justify-center(:style="{ 'height': '98px', 'border-radius': '12px 12px 0 0', 'position': 'relative' }")
              img.object-cover(v-if="fileIsDoc()" src="~/assets/icons/attachments/doc.svg" width="38px" height="46px")
              img.object-cover(v-else-if="fileIsVideo()" src="~/assets/icons/attachments/camera.svg" width="58px" height="46px")
              .bg-white.flex.items-center.justify-center.absolute.cursor-pointer(@click="url=''" :style="{ 'width': '20px', 'height': '20px', 'border-radius': '50%', 'right': '10px', 'top': '10px' }")
                q-icon(name="fas fa-times" color="primary")
            .row(v-if="originalUploadedFile" :style="{ 'padding': '12px' }")
              .col
                .font-lato.text-bold(:style="{ 'font-size': '11px', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'overflow': 'hidden' }") {{ originalUploadedFile.name }}
                .h-b2.text-italic {{ byteToKB(originalUploadedFile.size) }}
                  | KB
      input-file-ipfs(@uploading="uploading = true" @uploadedFile="url = arguments[0], uploading = false, originalUploadedFile = arguments[1]" ref="url" v-show="false")
  nav.q-mt-xl.row.justify-end.q-gutter-xs(v-if="$q.screen.gt.md")
    q-btn.q-px-xl(@click="$emit('prev')" color="primary" flat :label="$t('pages.proposals.create.stepdetails.back')" no-caps outline rounded v-if="!disablePrevButton")
    q-btn.q-px-xl(:disable="!canGoNext" @click="onNext" color="primary" :label="$t('pages.proposals.create.stepdetails.nextStep')" no-caps rounded unelevated)
  template(v-if="$q.screen.lt.md || $q.screen.md")
    q-card(:style="'border-radius: 25px; box-shadow: none; z-index: 7000; position: fixed; bottom: -20px; left: 0; right: 0; box-shadow: 0px 0px 26px 0px rgba(0, 0, 41, 0.2);'")
      creation-stepper(
        :activeStepIndex="stepIndex"
        :steps="steps"
        :nextDisabled="!canGoNext"
        @publish="$emit('publish')"
        @save="$emit('save')"
        @next="$emit('next')"
      )
</template>

<style lang="stylus" scoped>
.hidden-input
  opacity: 0
  overflow: hidden
  position: absolute
  width: 1px
  height: 1px
</style>
