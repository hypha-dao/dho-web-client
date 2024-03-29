<script>
import { ECOSYSTEM_DOMAIN, parseEcosystemDomain } from '~/const'
import ipfsy from '~/utils/ipfsy'
import { validation } from '~/mixins/validation'

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
      ECOSYSTEM_DOMAIN,
      form: {
        name: '',
        logo: '',
        domain: ECOSYSTEM_DOMAIN.SOCIO_ECOLOGICAL,
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
    hasBasicInfo () { return this.data && this.data.name && this.data.purpose }
  },

  methods: {
    async _handleSave () {
      try {
        const isValid = await this.validate(this.form)
        if (isValid) {
          this.$emit('save', this.form)
          this.isEditing = false
        }
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },
    ipfsy,
    parseEcosystemDomain
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
          span(v-else) {{ $t('ecosystem.ecosystem-info.firstStepConfigureYour') }}
            span.q-ml-xxs.text-weight-900 {{ $t('ecosystem.ecosystem-info.ecosystem') }}
        .text-sm.q-ml-xl.text-capitalize(v-if="form.domain") {{ hasBasicInfo ? form.domain.toLowerCase().replace('_',' ') : '' }}
      .text-base.leading-loose.text-weight-100.q-mt-xs(v-if="form.purpose") {{ hasBasicInfo ? form.purpose : '' }}
      span.relative-position
        q-btn.q-px-xl.rounded-border.text-bold.q-mt-xl.relative-position(:disable="!isAdmin" @click="isEditing = true" color="white" :label="$t('ecosystem.ecosystem-info.editEcosystemInformation')" no-caps outline rounded unelevated v-if="!isEditing")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('ecosystem.ecosystem-info.onlyDaoAdmins') }}
      q-btn.q-px-xl.rounded-border.text-bold.q-mt-xl(:disable="!isAdmin" @click="_handleSave" color="secondary" :label="$t('ecosystem.ecosystem-info.saveEcosystemInformation')" no-caps rounded unelevated v-if="isEditing")
  section(v-if="isEditing")
    .row.q-col-gutter-md.justify-between.q-pt-xl.q-px-md
      .col-4
        label.h-label.text-white {{ $t('ecosystem.ecosystem-info.ecosystemName') }}
        q-input.q-my-sm(:debounce="200" :rules="[rules.required]" bg-color="#343B64" color="white" dark dense lazy-rules outlined :placeholder="$t('ecosystem.ecosystem-info.typeNameHere')" ref="name" rounded v-model="form.name")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('ecosystem.ecosystem-info.onlyDaoAdmins1') }}
      .col-4
        .row.items-center
          q-avatar(size="64px" font-size="24px" color="secondary" text-color="white")
            img(v-if="form.logo" :src="ipfsy(form.logo)")
            img(v-if="!form.logo && !isUploadingLogo" src="/svg/icon-gallery.svg" style="max-width: 32px")
            loading-spinner(v-if="isUploadingLogo" color="primary" size="2em")
          .q-pl-xs
            label.h-label.text-white {{ $t('ecosystem.ecosystem-info.logo') }}
            q-btn.q-my-sm.q-px-xl.rounded-border.text-bold.full-width(@click="$refs.ipfsInput.chooseFile()" color="white" :label="$t('ecosystem.ecosystem-info.uploadAnImage')" no-caps outline rounded unelevated)
            input-file-ipfs(@finished="isUploadingLogo = false" @uploadedFile="form.logo = arguments[0]" @uploading="isUploadingLogo = true" image="image" ref="ipfsInput" v-show="false")
      .col-4
        .row.items-center.q-col-gutter-xs
          label.h-label.text-white {{ $t('ecosystem.ecosystem-info.showEcosystemOnMarketplace') }}
        .row.items-center.justify-between.q-mt-xs
          label.text-xs.text-white {{ $t('ecosystem.ecosystem-info.findInvestorsWilling') }}
          q-toggle(color="primary" keep-color="keep-color" v-model="form.marketplace")
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('ecosystem.ecosystem-info.onlyDaoAdmins2') }}
    .row.q-mt-xl
      .full-width.q-px-md
        label.h-label.text-white {{ $t('ecosystem.ecosystem-info.ecosystemDomain') }}
      .row.q-col-gutter-md.full-width
        template(v-for="(domain,index) in ECOSYSTEM_DOMAIN")
          .col-3
            q-btn.radio-button.q-my-sm.q-px-xl.rounded-border.text-bold.full-width(@click="form.domain = domain" color="white" :label="parseEcosystemDomain(domain)" no-caps outline rounded unelevated)
              q-radio(dense dark v-model="form.domain" :val="domain" color="white")
    .row.q-px-md.q-mt-xl
      .full-width
        label.h-label.text-white {{ $t('ecosystem.ecosystem-info.ecosystemPurpose') }}
        q-input.q-my-sm.rounded-border(:debounce="200" :input-style="{ 'resize': 'none' }" :rules="[rules.required]" bg-color="#343B64" color="white" dark dense lazy-rules maxlength="300" outlined :placeholder="$t('ecosystem.ecosystem-info.typeADescription')" ref="purpose" rounded rows="5" type="textarea" v-model="form.purpose")

</template>

<style lang="stylus">
.radio-button .q-btn__content
  text-align: left !important;
  justify-content: space-between !important;
</style>
