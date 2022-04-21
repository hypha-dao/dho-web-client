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
widget(title="Multi sig")
  p.h-b2.text-grey-7.ellipsis Click here to sign new PRs
  .row.q-pt-xxs
    div.inline.relative-position
      q-btn.h-btn1.q-px-xl(
          :loading="loading"
          @click="$router.push({ name: 'multi-sig' })"
          color="primary"
          label="Multi sig"
          no-caps
          rounded
          unelevated
        )
      q-badge(v-show="numberOfPRToSign > 0" rounded color="red" :label="numberOfPRToSign" class="notification-badge" size='10px')

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
