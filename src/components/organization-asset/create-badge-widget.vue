<script>
import CONFIG from '~/pages/proposals/create/config.js'
import { mapActions } from 'vuex'

export default {
  name: 'create-badge-widget',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {},

  data () {},

  methods: {
    ...mapActions('proposals', ['saveDraft']),
    onApply () {
      this.$store.commit('proposals/setType', CONFIG.options.organization.options.obadge.type)
      this.$store.commit('proposals/setCategory', { key: CONFIG.options.organization.options.obadge.key, title: CONFIG.options.organization.options.obadge.title })
      this.$store.commit('proposals/setStepIndex', 1)
      const draftId = Date.now()
      this.$store.commit('proposals/setDraftId', draftId)
      this.$store.commit('proposals/setPastSteps', ['step-proposal-type', 'step-details'])
      this.saveDraft()
      this.$router.push({ name: 'proposal-create', params: { draftId } })
    }
  }
}
</script>

<template lang="pug">
widget.item(:style="{ 'background': 'transparent', 'border': '1px solid #CBCDD1' }")
  .flex.items-center.justify-center(:style="{ 'border': '1px solid #242F5D', 'border-radius': '50%', 'width': '30px', 'height': '30px'}")
    q-icon(name="fas fa-plus" size="12px" color="primary")
  div
    .row.q-my-xs
      .h-h5.text-weight-bold {{ $t('organization-asset.create-badge-widget.createYourBadge') }}
    .row.q-my-xs
      .h-b2.description {{ $t('organization-asset.create-badge-widget.doYouNeedSpecific') }}
  q-btn.full-width(noCaps rounded outline color="primary" :style="{ 'font-weight': '600', 'margin-top': '75px' }" @click="onApply") {{ $t('organization-asset.create-badge-widget.newBadgeProposal') }}

</template>

<style lang="stylus" scoped>
.item
  .description
    height: 95px
    overflow hidden
</style>
