<script>
import removeMd from 'remove-markdown'
import { format } from '~/mixins/format'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'role-card',
  mixins: [format],
  props: {
    role: { type: Object, required: true }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    title () {
      const data = this.role.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      const data = this.role.strings.find(o => o.key === 'description')
      if (data) {
        return removeMd(data.value).replace(/\n/g, ' ')
      }
      return ''
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'roleView',
        data: this.role
      })
    },
    openApplicationForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentForm',
        data: this.role
      })
    }
  }
}
</script>

<template lang="pug">
q-card.role
  .ribbon
    span.text-white.bg-hire NOW HIRING
  .column.fit.flex.justify-between
    div
      q-card-section.text-center.q-pb-sm(@click="showCardFullContent")
        img.icon(src="~assets/icons/roles.svg")
      q-card-section
        .type(@click="showCardFullContent") Role
        .title(@click="showCardFullContent") {{ title }}
    div
      q-card-actions.q-pa-lg.flex.justify-between.role-actions
        q-btn(
          :disable="true"
          label="Enroll"
          color="hire"
          rounded
          dense
          unelevated
          @click="$router.push({ path: `/proposals/assignment/${role.id}`})"
        )
        q-btn(
          :disable="!isAuthenticated"
          label="Apply"
          color="hire"
          @click="openApplicationForm"
          rounded
          dense
          unelevated
        )
</template>

<style lang="stylus" scoped>
.role
  width 300px
  border-radius 1rem
  margin 10px
.role:hover
  transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
  transform scale(1.2) translate(0px, 40px) !important
  -moz-transform scale(1.2) translate(0px, 40px)
  -webkit-transform scale(1.2) translate(0px, 40px)
  z-index 10
  box-shadow 0 4px 8px rgba(0,0,0,0.2), 0 5px 3px rgba(0,0,0,0.14), 0 3px 3px 3px rgba(0,0,0,0.12)
.type
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
.title
  cursor pointer
  text-align center
  font-size 20px
  color $grey-6
  line-height 22px
.icon
  margin-top 20px
  width 100%
  max-width 100px
.role-actions
  button
    width 45%
</style>
