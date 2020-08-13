<script>
import { mapActions } from 'vuex'

export default {
  name: 'member-card',
  props: {
    member: { type: Object, required: true }
  },
  data () {
    return {
      profile: null
    }
  },
  async mounted () {
    this.profile = await this.getPublicProfile(this.member.member)
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile'])
  }
}
</script>

<template lang="pug">
q-card.member.cursor-pointer(@click="$router.push({ path: `/@${member.member}` })")
  q-card-section.text-center.q-pb-sm
    q-img.avatar(
      v-if="profile && profile.publicData.avatar"
      :src="profile.publicData.avatar"
      @click="$router.push({ path: `/@${member.member}`})"
    )
    q-avatar.avatar(
      v-else
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${member.member}`})"
    )
      | {{ member.member.slice(0, 2).toUpperCase() }}
  q-card-section
    .name {{ (profile && profile.publicData && profile.publicData.name) || member.member }}
</template>

<style lang="stylus" scoped>
.member
  width 250px
  border-radius 1rem
  margin 10px
.member:hover
  box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
.avatar
  border-radius 50% !important
  width 150px
.name
  font-size 24px
</style>
