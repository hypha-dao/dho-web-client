<script>
import { format } from '~/mixins/format'
import MemberCard from '../components/member-card'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'page-members-list',
  mixins: [format],
  components: { MemberCard },
  computed: {
    ...mapGetters('members', ['members', 'membersLoaded']),
    ...mapGetters('search', ['search']),
    filteredList () {
      if (this.search) {
        return this.members.filter(o => o.member.toLowerCase().includes(this.search))
      }
      return this.members
    }
  },
  beforeMount () {
    this.clearData()
    this.setBreadcrumbs([{ title: 'Members' }])
  },
  methods: {
    ...mapActions('members', ['fetchData']),
    ...mapMutations('members', ['clearData']),
    ...mapMutations('layout', ['setBreadcrumbs']),
    async onLoad (index, done) {
      await this.fetchData()
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .members-list(ref="membersListRef")
    q-infinite-scroll(
      :disable="membersLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.membersListRef"
    )
      .row.text-center
        member-card(
          v-for="member in filteredList"
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
