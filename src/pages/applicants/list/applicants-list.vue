<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ApplicantCard from '../components/applicant-card'

export default {
  name: 'page-applicants-list',
  components: { ApplicantCard },
  computed: {
    ...mapGetters('accounts', ['isEnroller']),
    ...mapGetters('applicants', ['applicants'])
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Enroll Org Members' }])
    this.clearData()
    await this.fetchData()
  },
  methods: {
    ...mapActions('applicants', ['fetchData']),
    ...mapMutations('applicants', ['clearData']),
    ...mapMutations('layout', ['setBreadcrumbs'])
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .row.text-center
    applicant-card(
      v-for="applicant in applicants"
      :key="applicant.applicant"
      :applicant="applicant"
    )
</template>
