<script>
import { forms } from '~/mixins/forms'
import { validation } from '~/mixins/validation'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { uid } from 'quasar'
import PeriodSelect from '~/components/form/period-select'

const defaultDesc = 'Please provide evidence that you meet or exceed the expectations set for this badge.'

export default {
  name: 'badge-assignment-form',
  mixins: [forms, validation],
  components: { PeriodSelect },
  props: {
    draft: { type: Object }
  },
  data () {
    return {
      form: {
        badge: null,
        seeds: 0,
        hvoice: 0,
        hypha: 0,
        husd: 0,
        title: null,
        description: defaultDesc,
        startPeriod: null,
        periodCount: null
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
      const success = await this.saveDraft({ type: 'badgeAssignment', draft: this.form })
      if (success) {
        await this.reset()
        this.hideForm()
        if (this.$router.currentRoute.path !== '/documents-proposal/badgeAssignment') {
          await this.$router.push({ path: '/documents-proposal/badgeAssignment' })
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
        periodCount: null,
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
          if (val.type === 'new') {
            this.reset()
            this.form.badge = val.badge.hash
            this.form.title = val.badge.title
            this.form.seeds = val.badge.seeds
            this.form.hvoice = val.badge.hvoice
            this.form.hypha = val.badge.hypha
            this.form.husd = val.badge.husd
          } else {
            this.form = {
              ...val
            }
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
  strong.title {{ form.title }}
  q-editor(
    v-model="form.description"
    :fullscreen.sync="isFullScreen"
    min-height="100px"
    :toolbar="isFullScreen ? fullScreenToolbar : defaultToolbar"
  )
  fieldset.q-mt-sm
    legend Token coefficients
    p Badges are a token of appreciation and achievement but they don’t create value unless you apply them to a contribution or assignment. The value is calculated by multiplying a percentage for each token in the boxes below, with 100% equal to no change in the compensation.
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-seeds.text-black(
          v-model="form.seeds"
          type="number"
          outlined
          readonly
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
          readonly
          dense
        )
        .hint HUSD
      .col-6
        q-input.bg-liquid.text-black(
          v-model="form.hvoice"
          type="number"
          outlined
          readonly
          dense
        )
        .hint HVOICE
      .col-6
        q-input.bg-liquid.text-black(
          v-model="form.hypha"
          type="number"
          readonly
          outlined
          dense
        )
        .hint HYPHA
  fieldset.q-mt-sm
    legend Lunar cycles
    p This is the lunar start and re-evaluation date for this badge assignment, followed by the number of lunar cycles. We recommend a maximum of 12 periods before reevaluation.
    .row.q-col-gutter-sm
      .col-xs-12.col-md-6
        period-select(
          ref="startPeriod"
          :value.sync="form.startPeriod"
          :period="form.startPeriod && form.startPeriod.value"
          :periods="form.edit ? periodOptionsEditProposal : periodOptionsStartProposal.slice(0, 8)"
          label="Start phase"
          required
        )
      .col-xs-12.col-md-6
        q-input(
          ref="periodCount"
          v-model="form.periodCount"
          label="Number of periods"
          type="number"
          outlined
          dense
          :rules="[rules.required, rules.greaterThan(0)]"
          lazy-rules
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
.title
  font-size 20px
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
