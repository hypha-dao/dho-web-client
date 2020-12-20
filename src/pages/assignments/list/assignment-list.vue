<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AssignmentCard from '../components/assignment-card'

export default {
  name: 'page-assignment-list',
  components: { AssignmentCard },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Assignments' }])
    await this.loadAssignments()
  },
  computed: {
    ...mapGetters('assignments', ['assignments'])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('assignments', ['loadAssignments'])
  }
}
</script>

<template lang="pug">
.row
  assignment-card(
    v-for="assignment in assignments"
    :key="assignment.hash"
    :assignment="assignment"
  )
</template>
