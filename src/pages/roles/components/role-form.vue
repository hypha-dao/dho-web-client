<script>
import { uid } from 'quasar'
import { validation } from '~/mixins/validation'
import { profileRequired } from '~/mixins/profile-required'
import { forms } from '~/mixins/forms'
import { format } from '~/mixins/format'
import { mapActions, mapMutations } from 'vuex'

const defaultDesc = '<b>Purpose</b><div>This guides the evolution of the role and is the part that changes the least.</div><div><br></div><div><b>Accountabilities</b></div><div>What is this role accountable to doing - what can others expect from this role? Provide a list of 5-10 bullet points.</div><div><br></div><div><b>Domain</b></div><div>What is under explicit control of that role? What do others need to ask this role permission to edit/change/interact with? Provide a list of tags.</div>'

export default {
  name: 'role-form',
  mixins: [forms, format, validation, profileRequired],
  props: {
    draft: { type: Object }
  },
  data () {
    return {
      form: {
        id: uid(),
        title: null,
        description: defaultDesc,
        url: null,
        salaryDeferred: null,
        salaryUsd: null,
        salaryCapacity: null,
        edit: false
      },
      salaryOptions: [
        { value: 70000, label: `B1 - ${this.toAsset(70000)}` },
        { value: 90000, label: `B2 - ${this.toAsset(90000)}` },
        { value: 110000, label: `B3 - ${this.toAsset(110000)}` },
        { value: 130000, label: `B4 - ${this.toAsset(130000)}` },
        { value: 150000, label: `B5 - ${this.toAsset(150000)}` },
        { value: 170000, label: `B6 - ${this.toAsset(170000)}` },
        { value: 190000, label: `B7 - ${this.toAsset(190000)}` }
      ],
      isFullScreen: false,
      submitting: false
    }
  },
  methods: {
    ...mapActions('profiles', ['saveDraft']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onSaveDraft () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.saveDraft({ type: 'role', draft: this.form })
      if (success) {
        await this.reset()
        this.hideForm()
        if (this.$router.currentRoute.path !== '/documents-proposal/role') {
          await this.$router.push({ path: '/documents-proposal/role' })
        }
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        id: uid(),
        title: null,
        description: defaultDesc,
        url: null,
        salaryDeferred: null,
        salaryUsd: null,
        salaryCapacity: null,
        edit: false
      }
      await this.resetValidation(this.form)
    },
    hideForm () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  },
  watch: {
    draft: {
      immediate: true,
      handler (val) {
        if (val) {
          this.form = {
            ...val
          }
        } else {
          this.reset()
        }
      }
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  q-input(
    ref="title"
    v-model="form.title"
    color="accent"
    label="Title"
    maxlength="100"
    :rules="[rules.required]"
    lazy-rules
    outlined
    dense
  )
  q-editor(
    v-model="form.description"
    :fullscreen.sync="isFullScreen"
    min-height="100px"
    :toolbar="isFullScreen ? fullScreenToolbar : defaultToolbar"
  )
  fieldset.q-mt-sm
    legend Supporting documentation
    q-input(
      ref="url"
      v-model="form.url"
      color="accent"
      label="URL Link"
      :rules="[rules.url]"
      lazy-rules
      outlined
      dense
    )
      template(v-slot:append)
        q-icon(
          name="fas fa-link"
          size="xs"
        )
  fieldset.q-mt-sm
    legend Salary
    p Fields below display the minimum % commitment and % HYPHA tokens vs. HUSD tokens required for this role as well as the role capacity (how many people can be assigned to this role) and USD equivalent.
    .row.q-col-gutter-sm.q-mb-md
      .col-xs-12.col-md-4
        q-input(
          ref="salaryDeferred"
          v-model="form.salaryDeferred"
          type="number"
          color="accent"
          label="Min. hypha"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(100)]"
          hint="Min %"
          lazy-rules
          outlined
          dense
          @blur="form.salaryDeferred = parseFloat(form.salaryDeferred).toFixed(0)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
      .col-xs-12.col-md-5
        q-select(
          ref="salaryUsd"
          v-model="form.salaryUsd"
          label="USD equivalent"
          :options="salaryOptions"
          map-options
          emit-value
          outlined
          dense
          :rules="[rules.required]"
          hint="Yearly"
          lazy-rules
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-dollar-sign"
              size="xs"
            )
      .col-xs-12.col-md-3
        q-input(
          ref="salaryCapacity"
          v-model="form.salaryCapacity"
          type="number"
          color="accent"
          label="ROLE CAP"
          :rules="[rules.required, rules.positiveAmount]"
          hint="1.0=FT"
          lazy-rules
          outlined
          dense
          @blur="form.salaryCapacity = parseFloat(form.salaryCapacity).toFixed(1)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-hashtag"
              size="xs"
            )
  .text-center.q-mt-sm
    q-btn.q-mr-sm(
      label="Cancel"
      rounded
      color="grey"
      dense
      unelevated
      @click="hideForm"
    )
    q-btn(
      label="Save draft"
      rounded
      color="green"
      dense
      unelevated
      :loading="submitting"
      @click="onSaveDraft"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
button
  width 30%
</style>
