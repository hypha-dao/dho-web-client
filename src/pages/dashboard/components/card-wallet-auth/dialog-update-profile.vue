<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'dialog-update-profile',
  props: {
    show: { type: Boolean, required: true }
  },
  data () {
    return {
      form: {
        fullName: null,
        avatar: null,
        description: null,
        fullDescription: null
      },
      submitting: false
    }
  },
  computed: {
    ...mapGetters('profile', ['accountName', 'profile'])
  },
  methods: {
    ...mapActions('profile', ['update']),
    async onSubmit () {
      this.submitting = true
      await this.update(this.form)
      this.submitting = false
      this.$emit('close')
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.form = {
          ...this.profile
        }
      }
    }
  }
}
</script>

<template lang="pug">
  q-dialog(
    v-model="show"
    persistent
    no-backdrop-dismiss
  )
    .row.update-profile-dialog
      q-card.col-md-6.col-sm-12.update-profile-card.q-pa-md(square)
        q-card-section
          .text-h6 Update your profile
        q-card-section
          q-input(
            v-model="form.fullName"
            label="Full name"
          )
          q-input(
            v-model="form.avatar"
            label="Avatar URL"
          )
          q-input(
            v-model="form.description"
            label="Short description"
            :maxlength="120"
            hint="A quick note about yourself"
          )
          q-input(
            v-model="form.fullDescription"
            type="textarea"
            label="Full Description"
            :maxlength="500"
            hint="Tell us more about you"
          )
      q-card.col-md-6.col-sm-12.update-profile-card.q-pa-md.text-center(square)
        q-card-section
          .text-h6 Preview
        q-card-section
          q-avatar(size="120px")
            img(:src="form.avatar || profile.avatar || 'statics/avatar-placeholder.png'")
        q-card-section
          .text-h6 {{ form.fullName || profile.fullName || 'Full name' }}
          strong.text-subtitle2 {{ accountName }}
        q-card-section
          i {{ form.description || profile.description || 'Short description' }}
          pre.text-left {{ form.fullDescription || profile.fullDescription || 'Full description' }}
      q-card.col-12(square)
        q-card-actions(align="right")
          q-btn(
            label="Cancel"
            @click="$emit('close')"
            flat
          )
          q-btn(
            label="Save"
            color="secondary"
            @click="onSubmit"
            :loading="submitting"
          )
</template>

<style lang="stylus">
.update-profile-dialog
  width 800px
  max-width 80vw !important
.update-profile-card
  min-width 400px
</style>
