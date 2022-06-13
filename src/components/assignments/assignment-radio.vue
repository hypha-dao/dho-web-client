<script>

import { dateToStringShort } from '~/utils/TimeUtils'
/**
 * A selectable 'radio button' which shows the title, description, start date and duration of an assignment.
 */
export default {
  name: 'assignment-radio',
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue')
  },

  props: {
    /**
     * Archetype object from backend
     */
    assignment: Object,
    /**
     * Whether this radio has been selected
     */
    selected: Boolean
  },

  // TODO: Move these methods to shared location
  methods: {
    description (assignment) {
      return `Started ${this.start(assignment)} | ${this.periodCount(assignment)} periods`
    },

    periodCount (assignment) {
      if (assignment) {
        if (assignment.__typename === 'Assignment' || assignment.__typename === 'Edit') {
          return assignment.details_periodCount_i
        }
      }
      return null
    },

    title (assignment) {
      return assignment.details_title_s
    },

    start (assignment) {
      if (assignment) {
        if (assignment.__typename === 'Edit' && assignment.original) {
          const date = assignment.original[0].details_startPeriod_c_edge.details_startTime_t
          return dateToStringShort(date, false)
        }
        if (assignment.__typename === 'Assignment') {
          const date = assignment.details_startPeriod_c_edge.details_startTime_t
          return dateToStringShort(date, false)
        }
      }
      return null
    },

    subtitle (assignment) {
      return assignment.role[0].details_title_s
    }
  }
}
</script>

<template lang="pug">
.assignment-radio
  button-radio.q-py-xs.q-px-xs(
    :title="title(assignment)"
    :subtitle="subtitle(assignment)"
    :description="description(assignment)"
    :selected="selected"
    @click="$emit('click')"
  )
</template>
