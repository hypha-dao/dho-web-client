<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AssignmentCard from '../components/assignment-card'

export default {
  name: 'page-assignments-list',
  components: { AssignmentCard },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('assignments', ['assignments', 'assignmentsLoaded'])
  },
  mounted () {
    this.clearData()
  },
  methods: {
    ...mapActions('assignments', ['fetchData']),
    ...mapMutations('assignments', ['clearData']),
    async onLoad (index, done) {
      await this.fetchData()
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .assignments-list(ref="assignmentsListRef")
    q-infinite-scroll(
      :disable="assignmentsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.assignmentsListRef"
    )
      .row.text-center
        assignment-card(
          v-for="assignment in assignments"
          :key="assignment.assignment_id"
          :assignment="assignment"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-page-sticky(
    v-if="isAuthenticated"
    position="bottom-right"
    :offset="[18, 18]"
  )
    q-btn(
      fab
      icon="fas fa-plus"
      color="red"
      size="lg"
      to="/proposals/assignments/add"
    )
</template>
