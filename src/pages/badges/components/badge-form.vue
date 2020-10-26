<script>
import { forms } from '~/mixins/forms'
import { validation } from '~/mixins/validation'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { uid } from 'quasar'
import PeriodSelect from '~/components/form/period-select'

const defaultDesc = '<b>Purpose</b><div>Describe the badge and why it should exist.</div><div><br></div><div><b>Criteria</b></div><div>List what criteria need to be fulfilled in order to receive the badge. This can be anything from skills, to seniority, to assessments, to activities.</div>'

export default {
  name: 'badge-form',
  mixins: [forms, validation],
  components: { PeriodSelect },
  props: {
    draft: { type: Object }
  },
  data () {
    return {
      form: {
        title: null,
        description: defaultDesc,
        icon: null,
        maxCycles: 0,
        seeds: 0,
        hvoice: 0,
        hypha: 0,
        husd: 0,
        startPeriod: null,
        endPeriod: null,
        cycles: null
      },
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periodOptionsStartProposal', 'periodOptionsEditProposal'])
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('profiles', ['saveDraft']),
    async onSaveDraft () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.saveDraft({ type: 'badge', draft: this.form })
      if (success) {
        await this.reset()
        this.hideForm()
        if (this.$router.currentRoute.path !== '/documents-proposal/badge') {
          await this.$router.push({ path: '/documents-proposal/badge' })
        }
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        id: uid(),
        title: null,
        description: defaultDesc,
        startPeriod: null,
        endPeriod: null,
        cycles: null,
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
    'form.startPeriod': {
      immediate: true,
      deep: true,
      handler (val) {
        if (this.form.endPeriod && val) {
          this.form.cycles = (this.form.endPeriod.value - val.value) / 4
        }
      }
    },
    'form.endPeriod': {
      immediate: true,
      deep: true,
      handler (val) {
        if (val && this.form.startPeriod) {
          this.form.cycles = (val.value - this.form.startPeriod.value) / 4
        }
      }
    },
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
    legend Badge restrictions
    .row.q-col-gutter-sm
      .col-md-6.col-xs-12
        q-input(
          ref="maxCycles"
          v-model="form.maxCycles"
          label="Max cycles"
          :rules="[rules.greaterThan(0)]"
          lazy-rules
          outlined
          dense
        )
      .col-md-6.col-xs-12
        | This value determines the maximum amount of cycles a badge holder can apply for.
  fieldset.q-mt-sm
    legend Token coefficients
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-seeds.text-black(
          v-model="form.seeds"
          type="number"
          outlined
          dense
        )
          template(v-slot:append)
            q-icon(
              name="img:app/icons/seeds.png"
              size="xs"
            )
        .hint Deferred Seeds
      .col-6
        q-input.bg-liquid.text-black(
          v-model="form.husd"
          type="number"
          outlined
          dense
        )
        .hint HUSD
      .col-6
        q-input.bg-liquid.text-black(
          v-model="form.hvoice"
          type="number"
          outlined
          dense
        )
        .hint HVOICE
      .col-6
        q-input.bg-liquid.text-black(
          v-model="form.hypha"
          type="number"
          outlined
          dense
        )
        .hint HYPHA
  fieldset.q-mt-sm
    legend Badge icon
    p Please add the link to the badge icon here. Our preferred place to store this icons are at&nbsp;
      a(href="https://assets.hypha.earth/minio/badges/" target="_blank") Minio
    q-input(
      ref="url"
      v-model="form.icon"
      color="accent"
      label="Icon url"
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
    legend Lunar cycles
    p This is the lunar start and re-evaluation date for this badge, followed by the number of lunar cycles. We recommend a maximum of 3 cycles before reevaluation.
    .row.q-col-gutter-sm
      .col-xs-12.col-md-4
        period-select(
          ref="startPeriod"
          :value.sync="form.startPeriod"
          :period="form.startPeriod && form.startPeriod.value"
          :periods="form.edit ? periodOptionsEditProposal : periodOptionsStartProposal.slice(0, 8)"
          label="Start phase"
          required
        )
      .col-xs-12.col-md-4
        period-select(
          ref="endPeriod"
          :value.sync="form.endPeriod"
          :period="form.startPeriod && (form.cycles || 0) && ((parseInt(form.startPeriod.value) + Math.min(parseInt(form.cycles || 0), 12) * 4) || 0)"
          :periods="form.edit ? periodOptionsEditProposal : form.startPeriod && periodOptionsStartProposal.filter(p => p.phase === form.startPeriod.phase && p.value > form.startPeriod.value).slice(0, 12)"
          label="Eval phase"
          required
        )
      .col-xs-12.col-md-4
        q-input(
          v-model="form.cycles"
          label="Cycles"
          type="number"
          readonly
          outlined
          dense
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
