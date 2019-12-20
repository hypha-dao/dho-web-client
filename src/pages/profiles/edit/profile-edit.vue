<script>
import { mapActions, mapGetters } from 'vuex'
import ImageProcessor from '~/components/form/image-processor'
import PhoneNumber from '~/components/form/phone-number'
import { validation } from '~/mixins/validation'
import { timeZones } from '~/mixins/time-zones'

export default {
  name: 'profile-edit',
  components: { ImageProcessor, PhoneNumber },
  mixins: [timeZones, validation],
  data () {
    return {
      contactMethodOptions: [
        { value: 'EMAIL', label: 'Email' },
        { value: 'SMS', label: 'SMS' }
      ],
      timeZonesFilteredOptions: [],
      tab: 'main',
      mainForm: {
        avatarFile: null,
        name: null,
        email: null,
        phoneNumber: null,
        contactMethod: null
      },
      aboutForm: {
        bio: ''
      },
      detailsForm: {
        coverFile: null,
        timeZone: null,
        tags: [],
        customFields: []
      },
      initPhoneNumber: null,
      avatarUrl: null,
      coverUrl: null,
      editAvatar: true,
      editCover: true,
      customField: null,
      splitter: 50,
      loading: true,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('profiles', ['isConnected']),
    ...mapGetters('accounts', ['account'])
  },
  async mounted () {
    if (this.account !== this.$route.params.username) {
      this.$router.push({ path: `/@${this.$route.params.username}` })
    } else {
      this.timeZonesFilteredOptions = this.timeZonesOptions
      await this.loadProfile()
      this.loading = false
    }
  },
  methods: {
    ...mapActions('profiles', ['saveProfile', 'getProfile']),
    async loadProfile () {
      const profile = await this.getProfile(this.$route.params.username)
      if (!profile) return
      this.mainForm.name = profile.publicData.name
      this.mainForm.contactMethod = profile.commPref
      this.mainForm.email = profile.emailInfo.value
      this.initPhoneNumber = profile.smsInfo.value

      this.detailsForm.timeZone = profile.publicData.timeZone
      this.detailsForm.tags = profile.publicData.tags
      this.detailsForm.customFields = profile.publicData.customFields

      this.aboutForm.bio = profile.publicData.bio

      this.avatarUrl = profile.publicData.avatar
      this.coverUrl = profile.publicData.cover
      this.editAvatar = !profile.publicData.avatar
      this.editCover = !profile.publicData.cover
    },
    filterTimeZones (val, update) {
      if (val === '') {
        update(() => {
          this.timeZonesFilteredOptions = this.timeZonesOptions
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.timeZonesFilteredOptions = this.timeZonesOptions.filter(
          v => v.text.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    onAddCustomField () {
      if (this.customField) {
        this.detailsForm.customFields.push({ label: this.customField, value: null })
        this.customField = null
      }
    },
    onDeleteCustomField (index) {
      this.detailsForm.customFields.splice(index, 1)
    },
    async onSubmit () {
      this.resetValidation(this.mainForm)
      if (!(await this.validate(this.mainForm))) return
      this.submitting = true
      if (this.$refs.profileAvatar) {
        this.mainForm.avatarFile = await this.$refs.profileAvatar.getBlob()
      }
      if (this.$refs.profileCover) {
        this.detailsForm.coverFile = await this.$refs.profileCover.getBlob()
      }
      await this.saveProfile({
        mainForm: this.mainForm,
        aboutForm: this.aboutForm,
        detailsForm: this.detailsForm
      })
      await this.loadProfile()
      this.$q.notify({
        color: 'green',
        message: 'Profile information saved',
        position: 'bottom-right'
      })
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  q-tabs(
    v-model="tab"
    align="justify"
    active-color="primary"
  )
    q-tab(name="main" label="Main information")
    q-tab(name="about" label="About you")
    q-tab(name="details" label="More details")
  q-separator
  q-tab-panels(v-model="tab" keep-alive)
    q-tab-panel(name="main")
      .row.q-col-gutter-md
        .col-xs-12.col-md-6
          q-card
            q-card-section
              .text-subtitle1 Personal information
            q-card-section
              q-input(
                ref="name"
                v-model="mainForm.name"
                label="Name"
                :rules="[rules.required]"
                lazy-rules
              )
              q-input(
                ref="email"
                v-model="mainForm.email"
                :label="`Email${mainForm.contactMethod === 'EMAIL' ? '*' : ''}`"
                :rules="[rules.requiredIf(mainForm.contactMethod === 'EMAIL')]"
                lazy-rules
              )
              phone-number(
                ref="phoneNumber"
                :value.sync="mainForm.phoneNumber"
                :init-value="initPhoneNumber"
                :required="mainForm.contactMethod === 'SMS'"
              )
              q-select(
                ref="contactMethod"
                v-model="mainForm.contactMethod"
                label="Preferred contact method*"
                :options="contactMethodOptions"
                map-options
                emit-value
                :rules="[rules.required]"
                lazy-rules
              )
        .col-xs-12.col-md-6
          q-card.full-height.relative-position
            .absolute.absolute-top-right(
              v-show="!editAvatar"
              :style="{zIndex: 10}"
            )
              q-btn(
                icon="edit"
                @click="editAvatar = true"
                size="md"
                color="accent"
                dense
                flat
              )
            q-card-section
              .text-subtitle1 Avatar
            q-card-section(v-show="editAvatar")
              image-processor(
                ref="profileAvatar"
                :width="200"
                :height="200"
                round
                @cancel="editAvatar = false"
              )
            q-card-section.text-center(v-show="!editAvatar")
              img.profile-avatar(:src="avatarUrl")
      q-inner-loading(:showing="loading")
        q-spinner-dots(
          color="primary"
          size="60px"
        )
    q-tab-panel(name="about")
      .row.flex.justify-between
        | Write about yourself so that people get to know you
        a.md-hint(
          href="https://www.markdownguide.org/cheat-sheet/"
          target="_blank"
        ) Markdown Cheat Sheet
      q-splitter(
        v-model="splitter"
        style="height: 500px;"
      )
        template(v-slot:separator)
          q-avatar(color="primary" text-color="white" size="28px" icon="fas fa-arrows-alt-h")
        template(v-slot:before)
          .q-pa-md
            textarea.fit.q-pa-sm(
              v-model="aboutForm.bio"
              rows="20"
            )
        template(v-slot:after)
          .q-pa-md
            q-markdown.fit.q-pa-sm(:src="aboutForm.bio")
      q-inner-loading(:showing="loading")
        q-spinner-dots(
          color="primary"
          size="60px"
        )
    q-tab-panel(name="details")
      .row.q-col-gutter-md
        .col-xs-12.col-md-6
          q-card
            q-card-section
              .text-subtitle1 More details
            q-card-section
              q-select(
                v-model='detailsForm.timeZone'
                use-input
                label="Time zone"
                :options="timeZonesFilteredOptions"
                @filter="filterTimeZones"
                option-value="value"
                option-label="text"
                emit-value,
                map-options
              )
              q-select(
                v-model="detailsForm.tags"
                label="Tags"
                use-input
                use-chips
                multiple
                hide-dropdown-icon
                new-value-mode='add-unique'
              )
              q-input(
                v-for="(field, index) in detailsForm.customFields"
                :key="index"
                v-model="detailsForm.customFields[index].value"
                :label="detailsForm.customFields[index].label"
                lazy-rules
                :rules="[rules.required]"
              )
                template(v-slot:append)
                  q-btn(round, dense, flat, icon="delete", color="red", @click="onDeleteCustomField(index)")
            q-card-section
              .text-subtitle2 Need more?
              q-input(
                v-model="customField"
                label="Add a custom information"
                placeholder="Ex: job"
              )
                template(v-slot:append)
                  q-icon.cursor-pointer(
                    name="add"
                    @click="onAddCustomField"
                  )
        .col-xs-12.col-md-6
          q-card.full-height.relative-position
            .absolute.absolute-top-right(
              v-show="!editCover"
              :style="{zIndex: 10}"
            )
              q-btn(
                icon="edit"
                @click="editCover = true"
                size="md"
                color="accent"
                dense
                flat
              )
            q-card-section
              .text-subtitle1 Cover
            q-card-section(v-show="editCover")
              image-processor(
                ref="profileCover"
                :width="1200"
                :height="200"
                @cancel="editCover = false"
              )
            q-card-section.text-center(v-show="!editCover")
              img.profile-cover(:src="coverUrl")
      q-inner-loading(:showing="loading")
        q-spinner-dots(
          color="primary"
          size="60px"
        )
  q-separator.q-my-md
  .flex.justify-end
    q-btn.q-mr-md(
      label="View"
      color="primary"
      :to="`/@${$route.params.username}`"
      flat
    )
    q-btn(
      label="Save"
      color="primary"
      @click="onSubmit"
      :loading="submitting"
      :disable="loading"
    )
</template>

<style lang="stylus" scoped>
.profile-avatar
  border 2px solid $primary
  border-radius 50%
.profile-cover
  width 100%
.md-hint
  text-decoration none
  color $primary
</style>
