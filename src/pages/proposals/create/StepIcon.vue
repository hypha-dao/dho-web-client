<script>
import ICONS from '~/assets/icons/FontAwesome-v5.0.9-Free.json'
export default {
  name: 'step-icon',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    IconCard: () => import('~/components/proposals/icon-card.vue'),
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
widget
  .q-mt-md
    .text-h6 Choose an icon
    .row
        .col
            q-input.q-my-md.rounded-border(
                v-model="iconSearch"
                outlined
                placeholder="Search icon for..."
                rounded
                debounce="800"
            )
                template(v-slot:prepend)
                    q-icon(name="fas fa-search" size="xs" color="primary")
        .h-b2.self-center.q-ml-md.no-padding or
        q-btn.q-ma-md(
          no-caps
          rounded
          outline
          color="primary"
          label="Upload an image"
          @click="onChoosingImage"
          v-show="!choosingImage"
        )
        input-file-ipfs.q-mr-lg.q-ml-sm.q-mb-md(
          :ipfsURL="selectedImage"
          preview
          image
          @uploadedFile="onImageSelected"
          previewSize="90px"
          v-show="choosingImage"
          ref="ipfsInput"
        )
    div( style="max-height: 500px; overflow: auto;" ref="scrollTargetRef")
      q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollTargetRef")
        template(v-slot:loading)
          div(class="row justify-center q-my-md")
            q-spinner-dots(color="primary" size="40px")
        .row.full-width.q-col-gutter-sm(v-if="filteredIcons")
          .col-sm-2(v-for="icon in filteredIcons" :key="icon[0]")
            icon-card.full-width(
              :name="`${icon[1].type || 'far'}  fa-${icon[0]}`"
              size="lg"
              @click="onIconSelected"
              :background="selectedIcon === `${icon[1].type || 'far'}  fa-${icon[0]}` ? 'bg-primary' : 'bg-grey-3'"
              :color="selectedIcon === `${icon[1].type || 'far'}  fa-${icon[0]}` ? 'white' : 'primary'"
            )
    //- .row.full-width.q-col-gutter-sm(v-if="filteredIcons")
    //-   .col-sm-2(v-for="icon in filteredIcons" :key="icon[0]")
    //-     icon-card.full-width(
    //-         :name="`${icon[1].type || 'far'}  fa-${icon[0]}`"
    //-         size="lg"
    //-         @click="onIconSelected"
    //-         :background="selectedIcon === `${icon[1].type || 'far'}  fa-${icon[0]}` ? 'bg-primary' : 'bg-grey-3'"
    //-         :color="selectedIcon === `${icon[1].type || 'far'}  fa-${icon[0]}` ? 'white' : 'primary'"
    //-     )
  .next-step.q-py-md
    .row.justify-between
      .nothing
      .buttons
        q-btn.q-px-md.q-mr-md(no-caps rounded flat color="primary" label="Prev step" @click="$emit('prev')")
        q-btn.q-px-md(no-caps rounded :disable="!selectedIcon && !selectedImage" color="primary" label="Next step" @click="$emit('next')")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
