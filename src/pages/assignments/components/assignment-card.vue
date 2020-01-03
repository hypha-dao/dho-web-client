<script>
import { format } from '~/mixins/format'

export default {
  name: 'assignment-card',
  mixins: [format],
  props: {
    assignment: { type: Object, required: true }
  },
  data () {
    return {
      details: false
    }
  }
}
</script>

<template lang="pug">
q-card.assignment
  .ribbon
    span.text-white.bg-assignment APPLYING
  q-card-section.text-center
    img.icon(src="~assets/icons/assignments.svg")
  q-card-section
    .type Assignment
    .title(@click="details = !details") {{ assignment.title }}
  q-card-section.description(v-show="details")
    p {{ assignment.description }}
  q-card-actions
    q-btn.full-width(
      label="Review applicant"
      color="assignment"
      rounded
    )
</template>

<style lang="stylus" scoped>
.assignment:hover
  transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
  transform scale(1.2) translate(0px, 40px) !important
  -moz-transform scale(1.2) translate(0px, 40px)
  -webkit-transform scale(1.2) translate(0px, 40px)
  z-index 10
.description
  white-space pre-wrap
.type
  text-transform capitalize
  text-align center
  font-weight bolder
  font-size 28px
.title
  cursor pointer
  text-align center
  font-size 20px
  color $grey-6
.icon
  margin-top 20px
  width 100%
  max-width 100px
.role-actions
  button
    width 45%
</style>
