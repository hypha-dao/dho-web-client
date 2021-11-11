<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'

export default {
  name: 'page-members',
  mixins: [documents],
  components: {
    MemberBanner: () => import('~/components/profiles/member-banner.vue'),
    MembersList: () => import('~/components/profiles/members-list.vue'),
    MembersFilters: () => import('~/components/profiles/members-filter.vue'),
    ProfileCard: () => import('~/components/profiles/profile-card.vue'),
    Widget: () => import('~/components/common/widget.vue')
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
      view: 'card',
      sort: 'Sort by last added',
      filter: null,
      options: ['Sort by last added', 'Sort by something else'],
      circle: 'All circles',
      circles: ['All circles', 'Circle One']
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
.page-members.full-width
  .row.full-width.relative-position.q-mb-md
    q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xs.close-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="white"
    )
    member-banner
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
    .col-3.q-pa-sm.q-py-md
      widget(title="Filters")
        .row.full-width.items-center.justify-between.q-pa-sm
          q-input.rounded-border.full-width(outlined v-model="filter" label="Filter by name")
        .row.full-width.items-center.justify-between.q-pa-sm
          .text-grey-6 Members view
          .btn-container
            q-btn.q-mr-sm(
              unelevated
              rounded
              padding="12px"
              size="sm"
              icon="fas fa-th-large"
              :color="view === 'card' ? 'primary' : 'grey-4'"
              :text-color="view === 'card' ? 'white' : 'primary'"
              @click="view = 'card'"
            )
            q-btn(
              unelevated
              rounded
              padding="12px"
              size="sm"
              icon="fas fa-list"
              :color="view === 'list' ? 'primary' : 'grey-4'"
              :text-color="view === 'list' ? 'white' : 'primary'"
              @click="view = 'list'"
            )
        .row.full-width.q-pa-sm
          q-select.full-width(dense filled v-model="sort" :options="options")
        .row.full-width.q-pa-sm
          q-select.full-width(dense filled v-model="circle" :options="circles")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px

.close-btn
  z-index 1
</style>
