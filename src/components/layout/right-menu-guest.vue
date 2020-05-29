<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'authentication',
  data () {
    return {
      searchExpanded: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('search', ['searchInput'])
  },
  methods: {
    ...mapMutations('search', ['setSearch', 'clearSearch']),
    openHelp () {
      window.open(process.env.DOCUMENTATION, '_blank')
    },
    onLogin () {
      this.$router.push({ path: `/login?returnUrl=${this.$route.path}` })
    }
  }
}
</script>

<template lang="pug">
div.flex.items-center(
  v-if="!isAuthenticated"
  :style="{ marginTop: !$q.platform.is.desktop ? '2px' : '0' }"
)
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
  q-btn.sign-btn.q-mr-sm(
    v-if="$q.platform.is.desktop || (!$q.platform.is.desktop && !searchExpanded)"
    label="LOGIN"
    color="white"
    text-color="black"
    rounded
    unelevated
    @click="onLogin"
  )
  q-btn.sign-btn(
    v-if="$q.platform.is.desktop || (!$q.platform.is.desktop && !searchExpanded)"
    to="/register"
    label="REGISTER"
    color="white"
    text-color="black"
    rounded
    unelevated
  )
</template>

<style lang="stylus" scoped>
.sign-btn
  height 40px
  margin 2px
  font-weight 600
  font-size 1.2em
  line-height 1.2em
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
