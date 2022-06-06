<script>
/**
 * Renders asset card list
 */
export default {
  name: 'asset-list',
  components: { AssetCard: () => import('~/components/organization-asset/asset-card.vue') },

  props: {
    /**
     * A list of { icon, docId, assignmentAggregate, assignment, title, description  } objects
     */
    assetList: Array
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
    ref="scroll"
  )
    .row.q-gutter-md
      asset-card(
        v-for="asset in assetList"
        :key="asset.docId"
        :asset="asset"
      )
    template(v-slot:loading)
      .row.justify-center.q-my-md
        q-spinner-dots(
          color="primary"
          size="40px"
        )
</template>
