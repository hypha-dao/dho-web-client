<script>
import MemberCard from '../components/member-card'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'page-members-list',
  components: { MemberCard },
  computed: {
    ...mapGetters('members', ['members', 'membersLoaded'])
  },
  mounted () {
    this.clearData()
  },
  methods: {
    ...mapActions('members', ['fetchData']),
    ...mapMutations('members', ['clearData']),
    async onLoad (index, done) {
      await this.fetchData()
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .members-list(ref="membersListRef")
    q-infinite-scroll(
      :disable="membersLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.membersListRef"
    )
      .row.text-center
        member-card(
          v-for="member in members"
          :key="member.member"
          :member="member"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
</template>
