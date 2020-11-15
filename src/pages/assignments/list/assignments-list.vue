<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AssignmentCard from '../components/assignment-card'
import ProposalCard from '../../proposals/components/proposal-card'
import AssignmentForm from '../components/assignment-form'

export default {
  name: 'page-assignments-list',
  components: { AssignmentCard, ProposalCard, AssignmentForm },
  data () {
    return {
      right: false,
      history: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('assignments', ['assignments', 'assignmentsLoaded'])
  },
  beforeMount () {
    this.clearData()
    this.setBreadcrumbs([{ title: 'Active Assignments' }])
  },
  methods: {
    ...mapActions('assignments', ['fetchData']),
    ...mapMutations('assignments', ['clearData']),
    ...mapMutations('layout', ['setBreadcrumbs']),
    async onLoad (index, done) {
      await this.fetchData(this.$route.params.username)
      done()
    }
  },
  watch: {
    '$route.params.username': function (val, old) {
      if (val !== old) {
        this.clearData()
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .assignments-list(ref="assignmentsListRef")
    q-infinite-scroll(
      :disable="assignmentsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.assignmentsListRef"
  )
      .row.text-center
        div(
          v-for="(assignment, i) in assignments"
          :key="i"
        )
          assignment-card(
            :assignment="assignment"
            :history="history"
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
