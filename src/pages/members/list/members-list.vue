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
      pagination: {
        first: 10,
        offset: 0
      },
      loaded: false
    }
  },

  computed: {
    ...mapGetters('members', ['members'])
  },

  async beforeMount () {
    this.clearMembers()
    this.setBreadcrumbs([{ title: 'Members' }])
  },

  methods: {
    ...mapActions('members', ['loadMembers']),
    ...mapMutations('members', ['clearMembers']),
    ...mapMutations('layout', ['setBreadcrumbs']),

    async onLoad (index, done) {
      this.loaded = await this.loadMembers(this.pagination)
      if (!this.loaded) {
        this.pagination.offset += this.pagination.first
      }
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  q-infinite-scroll(
    :disable="loaded"
    @load="onLoad"
    :offset="250"
  )
    .row
      member-card(
        v-for="member in members"
        :key="member.hash"
        :member="member"
      )
    template(v-slot:loading)
      .row.justify-center.q-my-md
        q-spinner-dots(
          color="primary"
          size="40px"
        )
</template>
