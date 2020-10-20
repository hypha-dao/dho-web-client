<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'card-title',
  props: {
    title: { type: String },
    type: { type: String }
  },
  data () {
    return {
      profile: null
    }
  },
  async beforeMount () {
    this.profile = await this.getPublicProfile(this.account)
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile'])
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    sponsor () {
      if (['badge', 'role'].includes(this.type)) {
        return `Sponsored by ${(this.profile && this.profile.publicData && this.profile.publicData.name) || this.account}`
      }
      return this.title
    },
    mainTitle () {
      if (['badge', 'role'].includes(this.type)) {
        return this.title
      }
      return (this.profile && this.profile.publicData && this.profile.publicData.name) || this.account
    }
  }
}
</script>

<template lang="pug">
div
  .title {{ mainTitle }}
  .sponsor(v-if="sponsor") {{ sponsor }}
</template>

<style lang="stylus" scoped>
.title
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
  line-height 1
.sponsor
  color $grey-6
  font-size 16px
</style>
