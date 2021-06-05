<script>
export default {
  name: 'active-assignments',
  components: {
    AssignmentItem: () => import('./assignment-item.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    assignments: {
      type: Array,
      default: () => []
    },
    owner: Boolean
  }
}
</script>

<template lang="pug">
widget(noPadding title="My works")
  .text-body2.q-mx-md.q-px-md(v-if="assignments.length === 0") No active assignments
  q-list.q-mx-md(v-else class="rounded-borders")
    template(v-for="assign in assignments")
      assignment-item(v-if="!assign.past" :assignment="assign" :expandable="true")
</template>
