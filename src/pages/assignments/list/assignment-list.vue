<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AssignmentCard from '../components/assignment-card'

export default {
  name: 'page-assignment-list',
  components: { AssignmentCard },
  data () {
    return {
      pagination: {
        first: 10,
        offset: 0
      },
      loaded: false,
      history: false
    }
  },
  async beforeMount () {
    this.clearAssignments()
    this.setBreadcrumbs([{ title: 'Assignments' }])
  },
  computed: {
    ...mapGetters('assignments', ['assignments'])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapMutations('assignments', ['clearAssignments']),
    ...mapActions('assignments', ['loadAssignments', 'loadUserAssignments']),
    async onLoad (index, done) {
      if (this.$route.params.user) {
        this.loaded = await this.loadUserAssignments({
          ...this.pagination,
          user: this.$route.params.user
        })
      } else {
        this.loaded = await this.loadAssignments(this.pagination)
      }
      if (!this.loaded) {
        this.pagination.offset += this.pagination.first
      }
      done()
    },
    async reload () {
      this.clearAssignments()
      this.pagination = {
        first: 10,
        offset: 0
      }
      this.loaded = false
    }
  }
}
</script>

<template lang="pug">
q-infinite-scroll(
  :disable="loaded"
  @load="onLoad"
  :offset="250"
)
  .row
    assignment-card(
      v-for="assignment in assignments"
      :key="assignment.hash"
      :assignment="assignment"
      :history="history"
      @claimed="reload"
    )
  template(v-slot:loading)
    .row.justify-center.q-my-md
      q-spinner-dots(
        color="primary"
        size="40px"
      )
  q-page-sticky(
    position="right"
    :offset="[18, 0]"
    :style="{'z-index': 100}"
  )
    q-btn(
      v-if="!history"
      fab
      icon="fas fa-history"
      color="accent"
      size="lg"
      @click="history = !history"
    )
      q-tooltip History
    q-btn(
      v-if="history"
      fab
      icon="fas fa-eye"
      color="accent"
      size="lg"
      @click="history = !history"
    )
      q-tooltip Active
</template>
