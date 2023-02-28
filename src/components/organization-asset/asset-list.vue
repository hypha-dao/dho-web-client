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
    bordered: Boolean,
    ownerStyles: Boolean,
    memberBadges: Array,
    currentElectionIndex: Number
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
.list(ref="scrollContainer")
  q-infinite-scroll(
    @load="onLoad"
    :offset="250"
    :scroll-target="$refs.scrollContainer"
    ref="scroll"
  ).full-width
    .row.q-col-gutter-md.q-mr-md
      .template.col-4(
        v-for="(asset,index) in assetList"
        :class="{ 'col-6': $q.screen.md, 'full-width': $q.screen.sm }"
        ).flex.justify-center
        asset-card(
          :key="asset.docId"
          :asset="asset"
          :isMobile="isMobile"
          :ownerStyles="ownerStyles"
          :bordered="bordered",
          :memberBadges="memberBadges"
          :currentElectionIndex="currentElectionIndex"
        )
      .col-4(:class="{ 'col-6': $q.screen.md, 'full-width': $q.screen.sm }")
        create-badge-widget(v-if="assetList && this.$route.params.type === 'badge'")
    template(v-slot:loading)
      .row.justify-center.q-my-md
        loading-spinner(
          color="primary"
          size="40px"
        )
</template>
