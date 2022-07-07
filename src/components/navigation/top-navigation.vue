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
    dhos: undefined,
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
    switchDao (url) { // TODO: Move to utils
      this.expanded = false
      this.$router.push({ name: this.activeTab || 'dashboard', params: { dhoname: url } })
    },
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
    .col-auto
      dho-btn(:name="dho.name" :title="dho.title" :logo="dho.icon" :disable="disabledSelector"  @click="expanded=!expanded")
    .col(v-if="expanded")
      .dao-container
        .col-auto(v-for="dao in dhos")
          div(:key="dao.name")
            dho-btn(v-bind="dao" :logo="dao.icon" @click="switchDao(dao.url)")
    .border-line
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
::-webkit-scrollbar {
  display: none;
}
.dao-container
  overflow-x scroll
  display flex

.inline
  display inline-block !important
.icon >>> i
  font-size 19px !important
.border-line
  height 40px

  .border-right
    border-right 1px solid $internal-bg
</style>
