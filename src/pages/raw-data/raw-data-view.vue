<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'
import KeyValueDisplay from './components/key-value-display'

export default {
  name: 'page-raw-data-view',
  components: { KeyValueDisplay },
  mixins: [validation],
  comments: { KeyValueDisplay },
  data () {
    return {
      form: {
        scope: null,
        id: null
      },
      loading: false,
      object: null
    }
  },
  async beforeMount () {
    const scope = this.$router.currentRoute.params.scope
    const id = this.$router.currentRoute.params.id
    this.form.scope = scope
    this.form.id = id
    if (scope && id) {
      await this.onGetObjectByScopeAndId(this.form)
    }
  },
  methods: {
    ...mapActions('objects', ['getObjectByScopeAndId']),
    async onSearch () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      await this.onGetObjectByScopeAndId(this.form)
    },
    async onGetObjectByScopeAndId ({ scope, id }) {
      this.loading = true
      this.object = await this.getObjectByScopeAndId({ scope, id })
      this.loading = false
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-md
  .row.flex.items-center.justify-between.q-pa-sm.bg-white.search-form
    q-input(
      ref="scope"
      v-model="form.scope"
      label="Object type"
      placeholder="Ex: proposal, assignment, role, ..."
      :rules="[rules.required]"
      lazy-rules
      style="width: 300px"
    )
    q-input(
      ref="id"
      v-model="form.id"
      label="Object id"
      type="number"
      :rules="[rules.required]"
      lazy-rules
    )
    q-btn(
      label="Search"
      icon="fas fa-search"
      color="primary"
      @click="onSearch"
      :loading="loading"
    )
  key-value-display(
    v-if="!loading && object"
    :object="object"
    :scope="form.scope"
    :id="parseInt(form.id)"
  )
  .flex.flex-center(v-if="loading")
    q-spinner-dots(
      color="primary"
      size="40px"
    )
</template>

<style lang="stylus" scoped>
.search-form
  width: 100%
  max-width: 600px
  border-radius: 5px
  margin-bottom: 20px
</style>
