<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AssignmentCard from '../components/assignment-card'

export default {
  name: 'page-assignment-list',
  components: { AssignmentCard },
  data () {
    return {
      history: false
    }
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'My assignments' }])
    await this.loadUserAssignments(this.$route.params.assignee)
  },
  computed: {
    ...mapGetters('assignments', ['userAssignments'])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('assignments', ['loadUserAssignments'])
  }
}
</script>

<template lang="pug">
.row
  assignment-card(
    v-for="assignment in userAssignments"
    :key="assignment.hash"
    :assignment="assignment"
    :history="history"
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
