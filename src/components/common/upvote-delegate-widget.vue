<script>
/**
 * Base component for any card-like element on screen
 * Handles title styling, margins and content padding
 */
import { mapGetters } from 'vuex'

export default {
  name: 'widget',
  props: {
    endDate: String,
    users: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },
  apollo: {
    upvoteElectionQuery: {
      query: require('~/query/upvote-election-data.gql'),
      update: data => {
        return {
          previousRounds: data.getDao.previouselct[0]?.round
        }
      },
      variables () {
        return {
          daoName: this.selectedDao.name
        }
      },
      result (data) {
        this.upvoteElectionData = {
          previousRounds: data.data.getDao.previouselct[0]?.round
        }
      }
    }
  },
  data () {
    return {
      counterdown: undefined,
      upvoteElectionData: {}
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao']),
    headWinners () {
      return this.upvoteElectionData.previousRounds[2]?.winner
    },
    chiefWinners () {
      return this.upvoteElectionData.previousRounds[1]?.winner
    }
  },
  mounted () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },
  activated () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },
  deactivated () {
    clearInterval(this.counterdown)
  },
  methods: {
    votingTimeLeft () {
      const end = new Date(this.endDate)
      const now = Date.now()
      const t = end - now
      return t
    },
    formatTimeLeft () {
      const MS_PER_DAY = 1000 * 60 * 60 * 24
      const MS_PER_HOUR = 1000 * 60 * 60
      const MS_PER_MIN = 1000 * 60
      const timeRemaining = this.votingTimeLeft()
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / MS_PER_DAY)
        let lesstime = timeRemaining - (days * MS_PER_DAY)
        const hours = Math.floor(lesstime / MS_PER_HOUR)
        lesstime = lesstime - (hours * MS_PER_HOUR)
        const min = Math.floor(lesstime / MS_PER_MIN)
        lesstime = lesstime - (min * MS_PER_MIN)
        return {
          days: days,
          hours: hours,
          mins: min
        }
      }
      return 0
    }
  }
}
</script>

<template lang="pug">
q-card.widget.full-width.q-pt-xl.q-pl-xl.q-pr-xs.q-pb-xs.relative-position.rounded(flat :class="{ 'q-pr-xl': $q.screen.md || $q.screen.lt.md }")
  .col
    .row.justify-between.items-center
      .row.items-center
        img(src="/svg/check-to-slot.svg" width="18px" height="14px")
        .title.text-bold.q-ml-sm Upvote Delegates

      .row(:class="{ 'q-mt-md': $q.screen.lt.md }")
        .counter(:class="{ 'right-margin': !$q.screen.lt.md }")
          .title Election validity expires in:
          .time.row
            .row.items-end
              .days {{ formatTimeLeft().days }}
              .subtext(v-if="formatTimeLeft().days > 1") days
              .subtext(v-else) day
            .row.items-end
              .hours {{ formatTimeLeft().hours }}
              .subtext(v-if="formatTimeLeft().hours > 1") hours
              .subtext(v-else) hour
            .row.items-end
              .mins {{ formatTimeLeft().mins }}
              .subtext(v-if="formatTimeLeft().mins > 1") mins
              .subtext(v-else) min
    .row.q-mt-md
      .template.col(v-for="user in headWinners" :class="{ 'col-6 q-px-xs': $q.screen.md, 'q-mr-md q-mb-md': $q.screen.gt.md, 'q-mb-md': $q.screen.md || $q.screen.lt.md, 'col-12': $q.screen.lt.md }")
        .user-card
          .tag HEAD DELEGATE
          .row.items-center.justify-between
            ProfilePicture(:username="user.details_member_n" size="50px" showUsername showName noMargins boldName withoutItalic)
            q-icon.card-icon(name="far fa-address-card" size="16px" color="white")
      .template.col(v-for="user in chiefWinners" :class="{ 'col-6 q-px-xs': $q.screen.md, 'q-mr-md q-mb-md': $q.screen.gt.md, 'q-mb-md': $q.screen.md || $q.screen.lt.md, 'col-12': $q.screen.lt.md }")
        .user-card
          .row.items-center.justify-between
            ProfilePicture(:username="user.details_member_n" size="50px" showUsername showName noMargins boldName withoutItalic)
            q-icon.card-icon(name="far fa-address-card" size="16px" color="white")
</template>

<style lang="stylus" scoped>
.rounded
  border-radius: 26px
.counter
  display: flex
  font-family: 'Lato', sans-serif
  font-weight: 600
  color: #3F64EE
  font-size: 18px
  .title
    margin-right: 25px
  .time
    .subtext
      font-size: 12px
      padding-bottom: 2px
      margin-right: 4px
.user-card
  border-radius: 14px
  border: 1px solid #C4C5C9
  padding: 7.5px 16px
  position: relative
  .card-icon
    width: 30px
    height: 30px
    display: flex
    border-radius: 50%
    justify-content: center
    align-items: center
    background: #242F5D
.right-margin
  margin-right: 20px
.title
  font-size: 22px
  color: #3E3B46
.tag
  display: flex
  height: 16px
  width: fit-content
  border-radius: 8px
  background: #3F64EE
  padding: 1.5px 8px
  color: #FFFFFF
  font-family: 'Lato', sans-serif
  font-weight: 600
  font-size: 9px
  position: absolute
  top: 0
  right: 0
</style>