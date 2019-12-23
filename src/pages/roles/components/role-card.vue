<script>
import { format } from '~/mixins/format'

export default {
  name: 'role-card',
  mixins: [format],
  props: {
    role: { type: Object, required: true }
  }
}
</script>

<template lang="pug">
q-card.cursor-pointer(
  @click="$router.push({ path: `/roles/${role.role_id}`})"
)
  q-card-section.text-center.bg-accent.text-white
      .text-h6 {{ role.title }}
  q-card-section.description.q-mt-md
    p {{ role.description }}
  q-card-section.text-right
    i {{ new Date(role.created_date).toDateString()}}
</template>

<style lang="stylus" scoped>
.description
  white-space pre-wrap
</style>
