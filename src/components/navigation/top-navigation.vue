<script>
export default {
  name: 'top-navigation',
  components: {
    DhoBtn: () => import('./dho-btn.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    dho: {
      type: Object,
      default: () => {
        return {
          name: 'Hypha DHO',
          icon: 'hypha-logo.svg'
        }
      }
    },
    profile: Object
  },

  data () {
    return {
      expanded: false
    }
  },

  methods: {
    imgSrc (img) {
      return require('~/assets/logos/' + img)
    }
  }
}
</script>

<template lang="pug">
.top-navigation.full-width.full-height
  .row.items-center
    .col-auto.justify-center
      .row.items-center.q-my-sm
        dho-btn.q-ml-md(v-bind="dho" @click="expanded=!expanded")
        .row(v-if="expanded")
          .col-auto
            dho-btn(v-bind="dho" @click="expanded=!expanded")
          .col-auto
            dho-btn(v-bind="dho")
          .col-auto
            dho-btn(v-bind="dho")
        .q-my-sm.q-ml-sm.border-line
          .border-right.full-height
    .col
    .col-auto(v-if="!expanded")
      q-btn.q-ma-md(flat unelevated rounded padding="12px" icon="fas fa-search"  size="sm" color="white" text-color="primary")
    .col-auto(v-if="!expanded")
      q-btn.q-mr-md(flat round @click="$emit('toggle-sidebar')")
        profile-picture(v-bind="profile" size="36px" badge="2")
</template>

<style lang="stylus" scoped>
.border-line
  height 40px

  .border-right
    border-right 1px solid $internal-bg
</style>
