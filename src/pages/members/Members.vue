<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'

export default {
  name: 'page-members',
  mixins: [documents],
  components: {
    MembersList: () => import('~/components/profiles/members-list.vue'),
    MembersFilters: () => import('~/components/profiles/members-filter.vue'),
    ProfileCard: () => import('~/components/profiles/profile-card.vue')
  },

  meta: {
    title: 'Members'
  },

  data () {
    return {
      pagination: {
        first: 10,
        offset: 0
      },
      loaded: false,
      view: 'card'
    }
  },

  computed: {
    ...mapGetters('members', ['members'])
  },

  async beforeMount () {
    this.clearMembers()
  },

  methods: {
    ...mapActions('members', ['loadMembers']),
    ...mapMutations('members', ['clearMembers']),

    async onLoad (index, done) {
      this.loaded = await this.loadMembers(this.pagination)
      if (!this.loaded) {
        this.pagination.offset += this.pagination.first
      }
      done()
    },

    getUsername (member) {
      return this.getValue(member, 'details', 'member')
    }
  }
}
</script>

<template lang="pug">
q-page.page-members
  .full-width.q-px-xl
    // .row.items-center.justify-between
    .row.q-mt-sm
      .col-9.q-px-sm.q-py-md
        q-infinite-scroll(:disable="loaded" @load="onLoad" :offset="250")
          .row.q-gutter-sm
            template(v-for="member in members")
              profile-card(:username="getUsername(member)" :view="view" :key="member.hash")
          template(v-slot:loading)
            .row.justify-center.q-my-md
              q-spinner-dots(
                color="primary"
                size="40px"
              )
        // members-list(:members="members" :view="view")
      .col-3.q-pa-sm.relative-position
        q-btn-toggle.absolute-top-right.in-front(v-model="view"
          padding="10px"
          size="sm"
          toggle-color="primary"
          :options="[{ value: 'list', icon: 'fas fa-list' },{ value: 'card', icon: 'fas fa-th-large' }]"
        )
        members-filters
</template>

<style lang="stylus" scoped>
.in-front {
  margin-right 32px
  margin-top 32px
  z-index 1
}
</style>
