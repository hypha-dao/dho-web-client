<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'page-alert-manager-form',
  mixins: [validation],
  data () {
    return {
      form: {
        level: 'success',
        content: null
      },
      submitting: false,
      removing: false,
      levelOptions: [
        { value: 'success', label: 'Success' },
        { value: 'info', label: 'Information' },
        { value: 'warning', label: 'Warning' },
        { value: 'danger', label: 'Danger' }
      ]
    }
  },
  async beforeMount () {
    const alert = await this.loadAlert()
    if (alert) {
      this.form.level = alert.level
      this.form.content = alert.content
    }
  },
  methods: {
    ...mapActions('layout', ['saveAlert', 'removeAlert', 'loadAlert']),
    async onSubmit () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      await this.saveAlert(this.form)
      this.submitting = false
    },
    async onRemove () {
      this.removing = true
      await this.removeAlert()
      this.removing = false
    }
  }
}
</script>

<template lang="pug">
q-page.flex.flex-center
  q-card.alert-manager-form
    q-card-section
      q-select(
        ref="level"
        v-model="form.level"
        :options="levelOptions"
        label="level"
        map-options
        emit-value
        :rules="[rules.required]"
        lazy-rules
      )
      q-input(
        label="Content"
        type="textarea"
        ref="content"
        v-model="form.content"
        :rules="[rules.required]"
        lazy-rules
      )
    q-card-actions.flex.justify-between
      q-btn(
        label="Remove"
        @click="onRemove"
        color="red"
        :loading="removing"
      )
      q-btn(
        label="Save"
        color="primary"
        @click="onSubmit"
        :loading="submitting"
      )
</template>

<style lang="sass" scoped>
.alert-manager-form
  max-width: 500px
  width: 100%
</style>
