<script>
export default {
  name: 'dho-btn',
  components: {
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue')
  },
  props: {
    name: String,
    title: String,
    logo: String,
    disable: Boolean
  },
  methods: {
    imgSrc (icon) {
      return require('~/assets/logos/' + icon)
    }
  }
}
</script>

<template lang="pug">
.container
  .q-ma-sm.no-pointer-events(v-if="disable")
    ipfs-image-viewer(
      :ipfsCid="logo"
      showDefault
      :defaultLabel="name"
      size="48px"
    )
    //- q-avatar(v-else
    //-   color="secondary"
    //-   text-color="white"
    //-   size="48px"
    //- ) {{ name.slice(0, 2) }}
  q-btn.q-ma-sm(v-else round @click="$emit('click')")
    //- q-avatar(v-if="icon" size="48px")
    //-   img(:src="imgSrc(icon)")
    //- q-avatar(v-else
    //-   color="secondary"
    //-   text-color="white"
    //-   size="48px"
    //- ) {{ name.slice(0, 2) }}
    ipfs-image-viewer(
      :ipfsCid="logo"
      showDefault
      :defaultLabel="name"
      size="48px"
    )
    q-tooltip(
      v-if="!disable"
      anchor="center right"
      self="center left"
      :content-style="{ 'font-size': '1em' }"
    ) {{ title }}
</template>
