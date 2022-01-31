<script>
import { validation } from '~/mixins/validation'

/**
 * Contact info component that is responsible for rendering and updating the contact info
 */
export default {
  name: 'contact-info',
  mixins: [validation],
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {

  },

  data () {
    return {
      phone: null,
      email: null,
      phoneToggle: false,
      emailToggle: false,
      editable: false
    }
  },

  computed: {

  },

  methods: {
    cancel () {
      this.editable = false
    },
    save () {
      this.editable = false
    },

    async validateForm () {
      await this.resetValidation(this.form)
      return await this.validate(this.form)
    },

    resetForm () {
      this.redeem = false
      this.form.amount = 0
      this.resetValidation(this.form)
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
widget(title="Contact Info"
  subtitle = "Only visible to you"
  editable = "true"
  @onEdit="editable = true"
  @onCancel="cancel"
  @onSave="save")
  .row.items-end.justify-center
    .col-1
      .text-caption.text-weight-bold.q-mb-sm Phone
      q-btn(round unelevated icon="fas fa-phone" color="primary" text-color="white" size="sm" :ripple="false")
    .col.q-pr-lg
      .row
        q-space
        q-toggle(v-model="phoneToggle" color="secondary" :disable= "!editable")
      .row
        q-input.full-width(dense rounded outlined
          v-model="phone"
          label="Phone"
          placeholder="+39 325 541 6341"
          type = "tel"
          :disable= "!phoneToggle || !editable")
    .col-1
      .text-caption.text-weight-bold.q-mb-sm Email
      q-btn(round unelevated icon="far fa-envelope" color="primary" text-color="white" size="sm" :ripple="false")
    .col
      .row
        q-space
        q-toggle(v-model="emailToggle" color="secondary" :disable= "!editable")
      .row
      q-input.full-width(dense rounded outlined
        v-model="email" label="Email"
        placeholder="emailadress@email.com"
        type = "email"
        :disable= "!emailToggle || !editable")
</template>

<style lang="stylus" scoped>

</style>
