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
  mounted () {
    this.clearData()
  },
  methods: {
    ...mapActions('applicants', ['fetchData']),
    ...mapMutations('applicants', ['clearData']),
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
      .row.q-col-gutter-md
        .col-xs-12.col-sm-6.col-md-4(v-for="applicant in applicants")
          applicant-card(:applicant="applicant")
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
</template>
