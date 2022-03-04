<script>
import TopRightIcon from '~/components/documents-parts/top-right-icon'
import { documents } from '~/mixins/documents'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'badge-card',
  mixins: [documents],
  props: { badge: { type: Object, required: true } },
  components: { TopRightIcon },
  data () {
    return {
      profile: null
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'badgeView',
        data: this.badge
      })
    },
    openApplicationForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'badgeAssignmentForm',
        data: {
          type: 'new',
          badge: {
            hash: this.badge.hash,
            title: this.title,
            seeds: this.seeds,
            hypha: this.hypha,
            hvoice: this.hvoice,
            husd: this.husd
          }
        }
      })
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'account']),
    details () {
      const details = this.badge.content_groups.find(cg => cg.contents.some(c => c.label === 'content_group_label' && c.value === 'details'))
      if (details && details.contents.length) {
        return details.contents
      }
      return null
    },
    title () {
      return this.getValue(this.badge, 'details', 'title')
    },
    seeds () {
      return this.getValue(this.badge, 'details', 'seeds_coefficient_x10000') / 100
    },
    hypha () {
      return this.getValue(this.badge, 'details', 'hypha_coefficient_x10000') / 100
    },
    hvoice () {
      return this.getValue(this.badge, 'details', 'hvoice_coefficient_x10000') / 100
    },
    husd () {
      return this.getValue(this.badge, 'details', 'husd_coefficient_x10000') / 100
    },
    icon () {
      return this.getValue(this.badge, 'details', 'icon')
    },
    proposer () {
      return this.badge.creator
    }
  },
  watch: {
    proposer: {
      immediate: true,
      async handler (val) {
        this.profile = val && await this.getPublicProfile(val)
      }
    }
  }
}
</script>

<template lang="pug">
q-card.badge.column
  top-right-icon(type="badge")
  q-card-section.text-center(@click="showCardFullContent")
    q-img.avatar(
      v-if="icon && icon !== ''"
      :src="icon"
    )
    q-avatar.avatar(
      v-else
      size="150px"
      color="primary"
      text-color="white"
    )
      | NA
  q-card-section(@click="showCardFullContent")
    .title {{ title }}
    .sponsor.text-center.q-mt-md Sponsored by {{ (profile && profile.publicData && profile.publicData.name) || proposer }}
  q-card-actions.q-pa-lg
    .flex.justify-around.full-width
      q-btn(
        :disable="!isAuthenticated || !isMember"
        label="Apply"
        color="hire"
        @click="openApplicationForm"
        rounded
        dense
        unelevated
      )
</template>

<style lang="stylus" scoped>
.badge
  width 300px
  border-radius 1rem
  margin 10px
  .badge:hover
    z-index 100
    box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
  .avatar
    cursor pointer
    margin-top 20px
    width 100%
    max-width 150px
    height 150px
  .title
    cursor pointer
    text-align center
    font-size 20px
    color $body
    line-height 22px
  .sponsor
    color $body
    font-size 16px
</style>
