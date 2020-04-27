<script>
import { mapGetters, mapMutations } from 'vuex'
import DialogRegister from '~/components/account/dialog-register'
import DialogLogin from '~/components/account/dialog-login'

export default {
  name: 'authentication',
  data () {
    return {
      showLogin: false,
      showRegister: false,
      searchExpanded: false
    }
  },
  components: { DialogLogin, DialogRegister },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('search', ['searchInput'])
  },
  methods: {
    ...mapMutations('search', ['setSearch', 'clearSearch']),
    openHelp () {
      window.open(process.env.DOCUMENTATION, '_blank')
    }
  }
}
</script>

<template lang="pug">
div.flex.items-center(v-if="!isAuthenticated")
  dialog-login(:show.sync="showLogin")
  dialog-register(:show.sync="showRegister")
  q-input.search(
    ref="search"
    :value="searchInput"
    @input="setSearch"
    placeholder="Search"
    rounded
    outlined
    bg-color="white"
    dense
    :class="{ 'search-expanded': searchExpanded, 'search-collapsed': !searchExpanded }"
  )
    template(v-slot:append)
      q-icon(
        v-if="!searchExpanded"
        name="fas fa-search"
        color="black"
        @click="() => { searchExpanded = !searchExpanded; $refs.search.focus() }"
      )
      q-icon(
        v-if="searchExpanded"
        name="fas fa-times"
        color="black"
        @click="() => { searchExpanded = !searchExpanded; clearSearch() }"
      )
  q-btn(
    v-if="$q.platform.is.desktop || (!$q.platform.is.desktop && !searchExpanded)"
    icon="far fa-life-ring"
    color="white"
    text-color="black"
    round
    unelevated
    style="width:40px;height:40px;margin: 4px"
    @click="openHelp"
  )
    q-tooltip Help
  q-btn.q-mr-sm(
    v-if="$q.platform.is.desktop || (!$q.platform.is.desktop && !searchExpanded)"
    icon="fas fa-sign-in-alt"
    color="white"
    text-color="black"
    round
    unelevated
    @click="showLogin = true"
    style="width:40px;height:40px;margin: 4px"
  )
    q-tooltip Login
  q-btn(
    v-if="$q.platform.is.desktop || (!$q.platform.is.desktop && !searchExpanded)"
    icon="fas fa-user-plus"
    color="white"
    text-color="black"
    round
    unelevated
    @click="showRegister = true"
    style="width:40px;height:40px;margin: 4px"
  )
    q-tooltip Register
</template>

<style lang="stylus" scoped>
.search
  height 42px
  /deep/.q-field__control:before
    border none
  i
    cursor pointer
.search-collapsed
  width 42px
  transition width 200ms
  i
    padding-right 18px
.search-expanded
  width 200px
  transition width 200ms
</style>
