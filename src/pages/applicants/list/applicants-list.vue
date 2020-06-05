<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ApplicantCard from '../components/applicant-card'

export default {
  name: 'page-applicants-list',
  components: { ApplicantCard },
  computed: {
    ...mapGetters('accounts', ['isEnroller']),
    ...mapGetters('applicants', ['applicants', 'applicantsLoaded'])
  },
  beforeMount () {
    this.clearData()
    this.setBreadcrumbs([{ title: 'Enroll Org Members' }])
  },
  methods: {
    ...mapActions('applicants', ['fetchData']),
    ...mapMutations('applicants', ['clearData']),
    ...mapMutations('layout', ['setBreadcrumbs']),
    async onLoad (index, done) {
      await this.fetchData()
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .applicants-list(ref="applicantsListRef")
    q-infinite-scroll(
      :disable="applicantsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.applicantsListRef"
    )
      .row.text-center
        applicant-card(
          v-for="applicant in applicants"
          :key="applicant.applicant"
          :applicant="applicant"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
</template>
