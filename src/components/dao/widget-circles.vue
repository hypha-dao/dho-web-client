<script>

const STATES = Object.freeze({
  WAITING: 'WAITING',
  CREATING: 'CREATING'
})

export default {
  name: 'widget-circles',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    form: {
      type: Object,
      default: () => {}
    },

    isAdmin: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      STATES,
      state: STATES.WAITING
    }
  },

  methods: {
    onSave () {}
  }

}
</script>

<template lang="pug">
widget(title='Circles' titleImage='/svg/chart-network.svg' :bar='true').q-pa-none.full-width.q-mt-sm
    p.text-sm.text-h-gray.leading-loose.q-mt-md Here you can set up your core teams or circles. Circles define the DAO's inner boundaries and domains. Any activity is tied to a single circle (the activity's home base) so that budgets can be maintained through the DAO.
    .hr.q-my-md

    section
        header.column.justify-center.text-center.items-center(v-if="state !== STATES.CREATING")
            p.text-sm.text-h-gray.leading-loose.q-mt-md Feel free to shape your DAO by creating circles or teams that are meaningful to your workflow.
            q-btn.q-px-xl.text-bold(
                @click="state = STATES.CREATING"
                color="primary"
                icon="fas fa-plus"
                label="Create new circle"
                no-caps
                rounded
                unelevated
            )

    section(v-if="state === STATES.CREATING")
        .full-width
            label.h-label Circle Name
            q-input.q-my-xs(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                outlined
                placeholder="Paste the URL address here"
                ref="name"
                rounded
                v-model='form.name'
            )
        .full-width.q-mt-sm
            label.h-label Circle Purpose
            q-input.q-my-sm(
                :debounce="200"
                :disable="!isAdmin"
                :input-style="{ 'resize': 'none' }"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                maxlength="300"
                outlined
                placeholder="Max 140 characters"
                ref="nickname"
                rounded
                rows="3"
                type="textarea"
                v-model='form.purpose'
            )

        nav.full-width.q-my-xl.row.justify-end
            q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-mr-xs(
                @click="state = STATES.WAITING"
                color="white"
                label="Cancel"
                no-caps
                rounded
                text-color="primary"
                unelevated
            )
            q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-ml-xs(
                @click="onSave"
                color="secondary"
                label="Done"
                no-caps
                rounded
                unelevated
            )

</template>

<style lang="stylus" scoped>
</style>
