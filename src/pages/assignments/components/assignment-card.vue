<script>
import { format } from '~/mixins/format'

export default {
  name: 'assignment-card',
  mixins: [format],
  props: {
    assignment: { type: Object, required: true }
  }
}
</script>

<template lang="pug">
q-card.cursor-pointer(
  @click="$router.push({ path: `/assignments/${assignment.assignment_id}`})"
)
  q-card-section.text-center.bg-assignments.text-white
      .text-h6 {{ assignment.title }}
  q-card-section.description.q-mt-md
    p {{ assignment.description }}
  q-card-section.text-right
    i {{ new Date(assignment.created_date).toDateString()}}
</template>

<style lang="stylus" scoped>
.description
  white-space pre-wrap
</style>
