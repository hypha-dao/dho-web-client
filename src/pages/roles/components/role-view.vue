<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'role-view',
  props: {
    id: { type: Number, required: true }
  },
  data () {
    return {
      loading: true,
      role: null
    }
  },
  computed: {
    ...mapGetters('periods', ['periods'])
  },
  methods: {
    ...mapActions('roles', ['fetchRole'])
  },
  watch: {
    id: {
      immediate: true,
      async handler (val) {
        this.loading = true
        this.role = await this.fetchRole(val)
        if (this.role) {
          this.role.startPeriod = this.periods.find(p => p.period_id === this.role.start_period)
          this.role.endPeriod = this.periods.find(p => p.period_id === this.role.end_period)
        }
        this.loading = false
      }
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  q-btn.q-mr-sm(
    label="Cancel"
    rounded
    color="grey"
    dense
    unelevated
    @click="$emit('close')"
  )
  q-inner-loading(:showing="loading")
    q-spinner-dots(
      color="primary"
      size="60px"
    )
</template>

<style lang="stylus" scoped>

</style>
