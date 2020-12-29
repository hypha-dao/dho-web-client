<script>
import { format } from '~/mixins/format'
import MemberCard from '../components/member-card'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'page-members-list',
  mixins: [format],
  components: { MemberCard },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters('members', ['members']),
    ...mapGetters('search', ['search']),
    filteredList () {
      if (this.search) {
        return this.members.filter(o => o.member.toLowerCase().includes(this.search))
      }
      return this.members
    }
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Members' }])
    await this.loadMembers()
    this.loading = false
  },
  methods: {
    ...mapActions('members', ['loadMembers']),
    ...mapMutations('layout', ['setBreadcrumbs'])
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .row.justify-center.q-my-md(v-if="loading")
    q-spinner-dots(
      color="primary"
      size="40px"
    )
  .row.text-center(v-else)
    member-card(
      v-for="member in filteredList"
      :key="member.hash"
      :member="member"
    )
</template>
