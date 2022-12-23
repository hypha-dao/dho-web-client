<script>
import ICONS from '~/assets/icons/FontAwesome-v5.0.9-Free.json'
export default {
  name: 'step-icon',
  components: {
    IconCard: () => import('~/components/proposals/icon-card.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue')

  },

  props: {
    fields: Object,
    stepIndex: Number,
    steps: Array,
    currentStepName: String,
    disablePrevButton: Boolean
  },
  data () {
    return {
      toolbar: [
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'underline', 'strike'],
        ['undo', 'redo']
      ],
      icons: Object.entries(Object.freeze(ICONS)),
      filteredIcons: [],
      temporalIcons: [],
      iconSearch: undefined,
      selectedIcon: undefined,
      selectedImage: undefined,
      type: undefined,
      pagination: {
        offset: 0,
        limit: 10
      },
      choosingImage: false
    }
  },
  mounted () {
    const split = (this.$store.state.proposals.draft.icon || '').split(':')
    this.selectedIcon = split[1]
    this.type = split[0]
  },
  watch: {
    iconSearch (search) {
      if (search.length === 0) {
        this.filteredIcons = this.temporalIcons
        this.temporalIcons = []
      } else {
        if (this.temporalIcons.length === 0) {
          this.temporalIcons = this.filteredIcons
        }
        this.filteredIcons = this.icons.filter(v => v[0].toLowerCase().includes(search.toLowerCase()))
      }
    },
    selectedIcon (iconName) {
      // this.$store.commit('proposals/setIcon', `${this.type}:${iconName}`)
    },
    selectedImage (ipfsId) {
      // this.$store.commit('proposals/setIcon', `${this.type}:${ipfsId}`)
    }
  },
  methods: {
    onIconSelected (v) {
      this.type = 'icon'
      this.selectedIcon = v
      this.choosingImage = false
      this.$store.commit('proposals/setIcon', `${this.type}:${v}`)
    },
    onImageSelected (ipfsId) {
      this.type = 'ipfsImage'
      this.selectedImage = ipfsId
      this.selectedIcon = undefined
      this.$store.commit('proposals/setIcon', `${this.type}:${this.selectedImage}`)
    },
    onChoosingImage () {
      this.choosingImage = true
      this.selectedIcon = undefined
      if (!this.selectedImage) {
        this.$refs.ipfsInput.chooseFile()
      } else {
        this.type = 'ipfsImage'
        this.$store.commit('proposals/setIcon', `${this.type}:${this.selectedImage}`)
      }
    },
    onLoad (index, done) {
      this.filteredIcons = this.filteredIcons.concat(this.icons.slice(this.pagination.offset, this.pagination.offset + this.pagination.limit))
      this.pagination.offset = this.pagination.offset + this.pagination.limit
      done()
    }
  },
  computed: {
    icon: {
      get () {
        return this.$store.state.proposals.draft.icon || ''
      },
      set (value) {
        this.$store.commit('proposals/setIcon', value)
      }
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
    }
  }
}
</script>

<template lang="pug">
widget(:class="{ 'disabled': currentStepName !== 'step-icon' && $q.screen.gt.md }")
  div
    label.h-h4 Choose an icon
    .flex(:class="{ 'no-wrap': $q.screen.gt.md }")
      .full-width(:class="{ 'q-my-xxl': $q.screen.gt.md }")
        q-input.q-my-md.q-mx-sm.rounded-border(
          debounce="800"
          dense
          outlined
          placeholder="Search icon for..."
          rounded
          v-model="iconSearch"
        )
          template(v-slot:prepend)
            q-icon(name="fas fa-search" size="xs" color="primary")
      .h-b2.self-center.no-padding.q-mx-sm(:class="{ 'q-my-sm':$q.screen.gt.md }") or
      .row.items-center.q-my-xxl.q-mx-sm(:class="{ 'col-6':$q.screen.gt.md }")
        q-btn.q-px-xl.rounded-border.text-bold(
          @click="$refs.ipfsInput.chooseFile()"
          color="primary"
          no-caps
          outline
          rounded
          unelevated
        ) Upload a file
        input-file-ipfs(
          @uploadedFile="onImageSelected"
          image
          ref="ipfsInput"
          v-show="false"
        )
    div( style="max-height: 500px; overflow: auto;" ref="scrollTargetRef")
      q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollTargetRef")
        template(v-slot:loading)
          div(class="row justify-center q-my-md")
            loading-spinner(color="primary" size="40px")
        .row.full-width.q-col-gutter-sm(v-if="filteredIcons")
          .col-sm-2(v-for="icon in filteredIcons" :key="icon[0]")
            icon-card.full-width(
              :name="`${icon[1].type || 'far'}  fa-${icon[0]}`"
              size="lg"
              @click="onIconSelected"
              :background="selectedIcon === `${icon[1].type || 'far'}  fa-${icon[0]}` ? 'bg-primary' : 'bg-grey-3'"
              :color="selectedIcon === `${icon[1].type || 'far'}  fa-${icon[0]}` ? 'white' : 'primary'"
            )
  nav(v-if="$q.screen.gt.md").row.justify-end.q-mt-xl.q-gutter-xs
    q-btn.q-px-xl(
      v-if="!disablePrevButton"
      @click="$emit('prev')"
      color="primary"
      label="Previous step"
      no-caps
      outline
      rounded
      unelevated
    )
    q-btn.q-px-xl(
      :disable="!selectedIcon && !selectedImage"
      @click="$emit('next')"
      color="primary"
      label="Next step"
      no-caps
      rounded
      unelevated
    )
  template(v-if="$q.screen.lt.md || $q.screen.md")
    q-card(:style="'border-radius: 25px; box-shadow: none; z-index: 7000; position: fixed; bottom: -20px; left: 0; right: 0; box-shadow: 0px 0px 26px 0px rgba(0, 0, 41, 0.2);'")
      creation-stepper(
        :style="'padding: 20px 50px 40px;'"
        :activeStepIndex="stepIndex"
        :steps="steps"
        :nextDisabled="nextDisabled"
        @publish="$emit('publish')"
        @save="$emit('save')"
        @next="$emit('next')"
      )
</template>

<style lang="stylus">
  .disabled
    opacity: 60% !important
    pointer-events: none
    border-radius: 26px
</style>
