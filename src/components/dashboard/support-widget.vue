<script>
import { openURL } from 'quasar'

export default {
  name: 'support-widget',
  components: {
    Widget: () => import('../common/widget.vue')
  },

  props: {
    documentationURL: String,
    documentationButtonText: String,

    socialChat: String
  },

  methods: {
    openLink (url) {
      openURL(url)
    }
  }
}
</script>

<template lang="pug">
widget(:title="$t('dashboard.support-widget.needSupport')")
  .flex.items-arround.full-height
    .h-b2.q-mt-md {{ $t('dashboard.support-widget.pleaseReadOur') }}
    .row.justify-between.flex.items-center.q-mb-sm
      .col-auto
        q-btn.q-mt-md.q-px-sm.text-white(noCaps rounded color="primary" @click="openLink(documentationURL || 'https://help.hypha.earth/hc/2431449449')") {{ documentationButtonText || $t('dashboard.support-widget.documentation') }}
      .col(v-if="socialChat")
        q-btn.q-mt-md.q-ml-sm.discord-buttom(unelevated rounded color="primary" icon="fab fa-discord" size="0.7rem" @click="openLink(socialChat)")
</template>

<style lang="stylus" scoped>
</style>
