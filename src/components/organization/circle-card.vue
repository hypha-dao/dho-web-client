<script>
export default {
  name: 'circle-card',
  components: {
    Widget: () => import('../common/widget.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue')
  },
  props: {
    id: String,
    name: String,
    members: {
      type: Array,
      default: () => []
    },
    subcircles: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      isExpanded: false
    }
  },

  computed: {
    expandIcon () {
      return this.isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
    }
  },

  methods: {
    toggleExpanded () {
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<template lang="pug">
widget.bg-internal-bg.q-my-md.cursor-pointer
  .row.justify-between
    .row.items-center
      .h-h4 {{ name }}
      .text-italic.q-ml-md(v-if="subcircles.length > 0") {{ $t('organization.circle-card.subCircles', { '1': subcircles.length }) }}
      q-btn.q-ml-md.text-primary.h-h7(:icon-right="expandIcon" @click="toggleExpanded" dense flat :label="$t('organization.circle-card.showSubcirclesDetails')" no-caps v-if="subcircles.length > 0")
    q-btn.q-ml-md.text-primary.h-h7(@click="$router.replace($route.path.includes('circles') ? id : 'circles/' + id)" dense flat icon-right="fas fa-chevron-right" :label="$t('organization.circle-card.goToCircle')" no-caps)
  template(v-if="isExpanded && subcircles")
    widget.q-pa-md.q-my-xs(v-if="subcircles" v-for="circle, index in subcircles" v-bind:key="index" noPadding)
      .row.items-center
        .h-h6(v-if="circle.name") {{ circle.name }}
        .text-italic.q-ml-md(v-if="members") {{ $t('organization.circle-card.members', { '1': members.length }) }}
  .column
    .text-italic.q-mt-xs.q-mb-sm {{ $t('organization.circle-card.members1', { '1': members.length }) }}
    .row.flex.profile-container
      .profile-item-wrapper(v-for="member, index in members" v-if="index <= 2")
        .profile-item
          profile-picture(:username="member.username" size="26px" :key="member.username")
          q-tooltip @
            | {{ member.username }}
      .profile-counter.bg-internal-bg(v-if="members.length > 3") +
        | {{ members.length - 3 }}
      .profile-counter.bg-internal-bg(v-else-if="!members.length") {{ $t('organization.circle-card.na') }}

</template>
<styles lang="stylus">
.profile-container
  margin-left 15px
.profile-item-wrapper
  display: flex
  align-items: center
  justify-content: center
  background: #FFFFFF
  width: 30px
  height: 30px
  border-radius: 50%
  z-index: 100
  margin-left: -10px
  .profile-item
    width 26px
.profile-counter
  display: flex
  align-items: center
  justify-content: center
  border-radius: 50%
  height: 30px
  width: 30px
  position: relative
  font-size: 10px
  font-weight: 600
  font-family: 'Source Sans Pro', sans-serif
  color: #242F5D
  margin-left: -10px
  z-index: 100
</styles>
