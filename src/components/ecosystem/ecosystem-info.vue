<script>
import ipfsy from '~/utils/ipfsy'
import { validation } from '~/mixins/validation'

const DOMAIN = Object.freeze({
  SOCIO_ECOLOGICAL: 'SOCIO_ECOLOGICAL',
  SOCIO_ECONOMICAL: 'SOCIO_ECONOMICAL',
  SOCIO_POLITICAL: 'SOCIO_POLITICAL',
  SOCIO_PSYCHOLOGICAL: 'SOCIO_PSYCHOLOGICAL'
})

export default {
  name: 'ecosystem-info',
  mixins: [validation],
  components: {
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  props: {
    data: {
      type: Object,
      default: () => {}
    },

    isAdmin: {
      type: Boolean,
      default: false
    }

  },

  data () {
    return {
      form: {
        name: '',
        logo: '',
        domain: DOMAIN.SOCIO_ECOLOGICAL,
        purpose: '',
        marketplace: false,
        ...this.data
      },

      isEditing: false,
      isOpen: true,
      isUploadingLogo: false
    }
  },

  computed: {
    DOMAIN_OPTIONS () {
      return [
        { label: 'Socio-Ecological', value: DOMAIN.SOCIO_ECOLOGICAL },
        { label: 'Socio-Economic', value: DOMAIN.SOCIO_ECONOMICAL },
        { label: 'Socio-Political', value: DOMAIN.SOCIO_POLITICAL },
        { label: 'Socio-Psychological', value: DOMAIN.SOCIO_PSYCHOLOGICAL }
      ]
    },

    hasBasicInfo () { return this.data && this.data.name && this.data.purpose }
  },

  methods: {
    ipfsy,

    async handleSave () {
      try {
        const isValid = await this.validate(this.form)
        if (isValid) {
          this.$emit('save', this.form)
          setTimeout(() => { this.isEditing = false }, 500)
        }
      } catch (error) {

      }
    }
  },

  watch: {

    data: {
      handler: async function (value) {
        this.form = { ...this.form, ...this.data }
      },
      immediate: false
    }
  }

}
</script>

<template lang="pug">
.full-width.q-pa-xxl.bg-primary.text-white.rounded-full
    .row
      .col-2
        q-avatar(size="184px" color="secondary" text-color="white")
          img(v-if="form.logo" :src="ipfsy(form.logo)")
          img(v-else src="/svg/icon-gallery.svg" style="max-width: 96px")
      .col.q-pl-md
        .row.items-center
          .text-3xl
            span(v-if="hasBasicInfo") {{ form.name }}
            span(v-else) First step: Configure your
              span.q-ml-xxs.text-weight-900 Ecosystem
          .text-sm.q-ml-xl.text-capitalize {{ hasBasicInfo ? form.domain.toLowerCase().replace('_',' ') :'' }}
        .text-base.leading-loose.text-weight-100.q-mt-xs {{ hasBasicInfo ? form.purpose :'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' }}
        span.relative-position
          q-btn.q-px-xl.rounded-border.text-bold.q-mt-xl.relative-position(
            :disable="!isAdmin"
            @click="isEditing = true"
            color="white"
            label="Edit Ecosystem Information"
            no-caps
            outline
            rounded
            unelevated
            v-if="!isEditing"
          )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings
        q-btn.q-px-xl.rounded-border.text-bold.q-mt-xl(
          :disable="!isAdmin"
          @click="handleSave"
          color="secondary"
          label="Save Ecosystem Information"
          no-caps
          rounded
          unelevated
          v-if="isEditing"
        )

    section(v-if="isEditing")
      .row.q-col-gutter-md.justify-between.q-pt-xl.q-px-md
        .col-4
          label.h-label.text-white Ecosystem Name
          q-input.q-my-sm(
            :debounce="200"
            :rules="[rules.required]"
            bg-color="#343B64"
            color="white"
            dark
            dense
            lazy-rules
            outlined
            placeholder="Type Name here (Max 30 Characters)"
            ref="name"
            rounded
            v-model='form.name'
          )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-4
          .row.items-center
            q-avatar(size="64px" font-size="24px" color="secondary" text-color="white")
              img(v-if="form.logo" :src="ipfsy(form.logo)")
              img(v-if="!form.logo && !isUploadingLogo" src="/svg/icon-gallery.svg" style="max-width: 32px")
              loading-spinner(v-if="isUploadingLogo" color="primary" size="2em")
            div.q-pl-xs
              label.h-label.text-white Logo
              q-btn.q-my-sm.q-px-xl.rounded-border.text-bold.full-width(
                @click="$refs.ipfsInput.chooseFile()"
                color="white"
                label="Upload an image (max 3MB)"
                no-caps
                outline
                rounded
                unelevated
              )
              input-file-ipfs(
                @finished="isUploadingLogo = false"
                @uploadedFile="form.logo = arguments[0]"
                @uploading="isUploadingLogo = true"
                image
                ref="ipfsInput"
                v-show="false"
              )

            //- .col
                //- ipfs-image-viewer(:ipfsCid="form.logo").hidden
            //- q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-4
          .row.items-center.q-col-gutter-xs
              label.h-label.text-white Show Ecosystem on Marketplace
          .row.items-center.justify-between.q-mt-xs
              label.text-xs.text-white Find investors willing to fund your Ecosystem
              q-toggle( color="primary" keep-color v-model="form.marketplace")
                  q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      .row.q-mt-xl
        .full-width.q-px-md
          label.h-label.text-white Ecosystem Domain
        .row.q-col-gutter-md.full-width
          template(v-for="(domain,index) in DOMAIN_OPTIONS")
            .col-3
              q-btn.radio-button.q-my-sm.q-px-xl.rounded-border.text-bold.full-width(
                @click="form.domain = domain.value"
                color="white"
                :label="domain.label"
                no-caps
                outline
                rounded
                unelevated

              )
                q-radio(dense dark v-model="form.domain" :val="domain.value" color="white")

      .row.q-px-md.q-mt-xl
        .full-width
          label.h-label.text-white Ecosystem Purpose
          q-input.q-my-sm.rounded-border(
            :debounce="200"
            :input-style="{ 'resize': 'none' }"
            :rules="[rules.required]"
            bg-color="#343B64"
            color="white"
            dark
            dense
            lazy-rules
            maxlength="300"
            outlined
            placeholder="Type a description here (max 300 characters)"
            ref="purpose"
            rounded
            rows='5'
            type="textarea"
            v-model='form.purpose'
          )
</template>

<style lang="stylus">
.radio-button .q-btn__content
  text-align: left !important;
  justify-content: space-between !important;
</style>
