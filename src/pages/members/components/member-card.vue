<script>
import { mapActions } from 'vuex'
import { documents } from '~/mixins/documents'
import BadgeAssignmentsStack from '~/components/documents-parts/badge-assignments-stack'

export default {
  name: 'member-card',
  mixins: [documents],
  components: { BadgeAssignmentsStack },
  props: {
    member: { type: Object, required: true }
  },
  data () {
    return {
      profile: null
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile'])
  },
  computed: {
    name () {
      console.log(this.member)
      return this.getValue(this.member, 'details', 'name')
    }
  },
  watch: {
    name: {
      immediate: true,
      async handler (val) {
        this.profile = await this.getPublicProfile(val)
      }
    }
  }
}
</script>

<template lang="pug">
q-card.member.cursor-pointer(@click="$router.push({ path: `/@${name}` })")
  q-card-section.text-center.q-pb-sm.relative-position
    badge-assignments-stack.badge-stack(v-if="name" :username="name")
    q-img.avatar(
      v-if="profile && profile.publicData.avatar"
      :src="profile.publicData.avatar"
      @click="$router.push({ path: `/@${name}`})"
    )
    q-avatar.avatar(
      v-else
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${name}`})"
    )
      | {{ name.slice(0, 2).toUpperCase() }}
  q-card-section
    .name {{ (profile && profile.publicData && profile.publicData.name) || name }}
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
