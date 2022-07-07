<script>
export default {
  name: 'top-navigation',
  components: {
    DhoBtn: () => import('./dho-btn.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    InputField: () => import('~/components/common/input-field.vue')
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
      expanded: false,
      searching: false,
      searchInput: undefined
    }
  },

  methods: {
    isActiveRoute (name) { return this.$route.name === name }, // TODO: Move to utils
    clearSearchInput () {
      this.searchInput = undefined
      this.searching = false
    },
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
    .col.justify-end.flex(v-if="!expanded")
      .div.inline(v-if="!searching")
        q-btn.q-mr-xxs.icon(flat unelevated rounded padding="12px" icon="fas fa-search"  size="sm" color="white" text-color="primary" @click="searching=!searching")
        q-btn.q-mr-xxs.icon(:to="{ name: 'configuration' }" unelevated rounded padding="12px" icon="fas fa-cog"  size="sm" )
        q-btn.q-mr-xs.icon(:to="{ name: 'support' }" unelevated rounded padding="12px" icon="far fa-question-circle"  size="sm" color="white" text-color="primary")
      input-field.q-mr-md.search.inline(
        v-if="searching"
        v-model="searchInput"
        placeholder="Search the whole DAO"
        bg-color="white"
        dense
        debounce="500"
        @input="$emit('search', searchInput)"
      )
        template(v-slot:prepend)
          q-icon(size="xs" color="primary" name="fas fa-search")
        template(v-slot:append)
          q-icon(size="xs" color="primary" name="fas fa-times" @click="clearSearchInput")
      q-btn.q-mr-md(flat round @click="$emit('toggle-sidebar')")
        profile-picture(v-bind="profile" size="36px")
</template>

<style lang="stylus" scoped>
.inline
  display inline-block !important
.icon >>> i
  font-size 19px !important
.border-line
  height 40px

  .border-right
    border-right 1px solid $internal-bg
</style>
