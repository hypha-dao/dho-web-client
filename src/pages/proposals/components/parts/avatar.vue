<script>
import { mapActions, mapGetters } from 'vuex'
import { adorableAvatar } from '~/mixins/adorable-avatar'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'

export default {
  name: 'avatar',
  mixins: [documents, format, adorableAvatar],
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
    annualSalary () {
      let amount
      if (this.draft) {
        if (this.draft.role) {
          return this.getValue(this.draft.role, 'details', 'annual_usd_salary')
        } else {
          return this.draft.salaryUsd
        }
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
      return this.getSalaryBucket(amount)
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
  .salary-bucket.bg-proposal(v-if="annualSalary") {{ getSalaryBucket(parseInt(annualSalary)) }}
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
