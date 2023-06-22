<script>

export default {
  name: 'organizations',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  data () {
    return {
      loading: false
    }
  },

  props: {
    numberOfPRToSign: Number
  }

}
</script>

<template lang="pug">
widget(:title="$t('profiles.multi-sig.multiSig')")
  p.h-b2.text-grey-7.ellipsis {{ $t('profiles.multi-sig.clickHereTo') }}
  .row.q-pt-xxs
    .inline.relative-position
      q-btn.h-btn1.q-px-xl(:loading="loading" @click="$router.push({ name: 'multi-sig' })" color="primary" :label="$t('profiles.multi-sig.multiSig1')" no-caps="no-caps" rounded="rounded" unelevated="unelevated")
      q-badge.notification-badge(v-show="numberOfPRToSign > 0" rounded="rounded" color="red" :label="numberOfPRToSign" size="10px")

</template>

<style lang="stylus" scoped>
.notification-badge
  position: absolute;
  z-index: 1000;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  font-size: 10px;
</style>
