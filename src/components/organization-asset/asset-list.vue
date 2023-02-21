<script>
/**
 * Renders asset card list
 */
export default {
  name: 'asset-list',
  components: {
    AssetCard: () => import('~/components/organization-asset/asset-card.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    CreateBadgeWidget: () => import('~/components/organization-asset/create-badge-widget.vue')
  },

  props: {
    /**
     * A list of { icon, docId, assignmentAggregate, assignment, title, description  } objects
     */
    assetList: Array,
    isMobile: Boolean,
    bordered: Boolean
  },
  data () {
    return {

    }
  },
  methods: {
    onLoad (index, done) {
      this.$emit('loadMore', index, done)
    },
    stop () {
      this.$refs.scroll.stop()
    },
    resume () {
      this.$refs.scroll.resume()
    },
    trigger () {
      this.$refs.scroll.trigger()
    }
  },
  async mounted () {
    await this.$nextTick()
    this.$refs.scroll?.stop()
  }
}
</script>

<template lang="pug">
.list.row(ref="scrollContainer")
  q-infinite-scroll(
    @load="onLoad"
    :offset="250"
    :scroll-target="$refs.scrollContainer"
    @load="onLoad"
    ref="scroll"
  ).full-width
    .row.q-gutter-md
      asset-card(
        v-for="asset in assetList"
        :key="asset.docId"
        :asset="asset"
        :isMobile="isMobile"
        :bordered="bordered"
      )
      create-badge-widget(v-if="assetList && this.$route.params.type === 'badge'")
    template(v-slot:loading)
      .row.justify-center.q-my-md
        loading-spinner(
          color="primary"
          size="40px"
        )
</template>
