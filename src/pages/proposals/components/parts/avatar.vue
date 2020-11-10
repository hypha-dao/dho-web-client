<script>
import { format } from '~/mixins/format'
import { mapActions, mapGetters } from 'vuex'
import { adorableAvatar } from '~/mixins/adorable-avatar'

export default {
  name: 'avatar',
  mixins: [format, adorableAvatar],
  props: {
    draft: { type: Object },
    title: { type: String },
    type: { type: String }
  },
  data () {
    return {
      profile: null,
      avatarSrc: null,
      avatarColor: null
    }
  },
  async beforeMount () {
    if (this.obj === 'user') {
      this.profile = await this.getPublicProfile(this.account)
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile'])
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    obj () {
      if (this.type === 'role') {
        return 'adorable'
      } else if (this.type === 'badge') {
        return 'external'
      }
      return 'user'
    },
    salaryBucket () {
      let amount
      if (this.draft) {
        amount = this.draft.salaryUsd
      } else if (this.proposal) {
        let asset = this.proposal.assets.find(o => o.key === 'annual_usd_salary')
        if (this.role) {
          asset = this.role.assets.find(o => o.key === 'annual_usd_salary')
        }
        if (asset) {
          amount = parseInt(asset.value)
        }
      }
      if (!amount) return null
      if (amount <= 80000) {
        return 'B1'
      } else if (amount > 80000 && amount <= 100000) {
        return 'B2'
      } else if (amount > 100000 && amount <= 120000) {
        return 'B3'
      } else if (amount > 120000 && amount <= 140000) {
        return 'B4'
      } else if (amount > 140000 && amount <= 160000) {
        return 'B5'
      } else if (amount > 160000 && amount <= 180000) {
        return 'B6'
      } else if (amount > 180000) {
        return 'B7'
      }
      return null
    }
  },
  watch: {
    title: {
      immediate: true,
      async handler (val) {
        const hash = await this.toSHA256(val)
        const { image, color } = await this.getAdorableImage(hash)
        this.avatarSrc = image
        this.avatarColor = color
      }
    }
  }
}
</script>

<template lang="pug">
div
  q-img.avatar(
    v-if="obj === 'adorable'"
    :src="this.avatarSrc"
    :style="`background: ${this.avatarColor}`"
  )
  q-img.avatar(
    v-if="obj === 'external'"
    :src="draft.icon"
  )
  q-img.avatar(
    v-if="obj === 'user' && profile && profile.publicData && profile.publicData.avatar"
    :src="profile.publicData.avatar"
    @click="$router.push({ path: `/@${account}`})"
  )
  q-avatar.avatar(
    v-if="obj === 'user' && (!profile || !profile.publicData || !profile.publicData.avatar)"
    size="150px"
    color="accent"
    text-color="white"
    @click="$router.push({ path: `/@${account}`})"
  )
    | {{ account.slice(0, 2).toUpperCase() }}
  .salary-bucket.bg-proposal(v-if="salaryBucket") {{ salaryBucket }}
</template>

<style lang="stylus" scoped>
.avatar
  cursor pointer
  border-radius 50% !important
  margin-top 20px
  width 100%
  max-width 150px
  height 150px
.salary-bucket
  position absolute
  bottom 10px
  right 80px
  color white
  font-size 28px
  font-weight 700
  border-radius 50%
  width 45px
</style>
