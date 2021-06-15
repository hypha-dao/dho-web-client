<script>
import showdown from 'showdown'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { format } from '~/mixins/format'
import { adorableAvatar } from '~/mixins/adorable-avatar'
import { documents } from '~/mixins/documents'
import TopRightIcon from '~/components/documents-parts/top-right-icon'

export default {
  name: 'role-card',
  mixins: [documents, format, adorableAvatar],
  components: { TopRightIcon },
  props: {
    role: { type: Object, required: true }
  },
  data () {
    return {
      profile: null,
      avatarSrc: null,
      avatarColor: null,
      suspendReason: ''
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'account']),
    proposer () {
      return this.role.creator
    },
    title () {
      return this.getValue(this.role, 'details', 'title')
    },
    description () {
      return this.getValue(this.role, 'details', 'description')
    },
    url () {
      return this.getValue(this.role, 'details', 'url')
    },
    annualSalary () {
      return this.getValue(this.role, 'details', 'annual_usd_salary')
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('roles', ['suspendRole']),
    async onSuspendRole () {
      await this.suspendRole({ hash: this.role.hash, reason: this.suspendReason })
      if (this.$router.currentRoute.path !== '/documents-proposal/assignment') {
        await this.$router.push({ path: '/documents-proposal/assignment' })
      }
    },
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
        data: {
          type: 'new',
          role: this.role
        }
      })
    },
    editObject () {
      // TODO verify
      const converter = new showdown.Converter()
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'roleForm',
        data: {
          hash: this.role.hash,
          title: this.title,
          description: converter.makeHtml(this.description),
          url: this.url,
          salaryDeferred: this.minDeferred,
          salaryUsd: this.usdEquity,
          salaryCapacity: this.ftCapacity,
          edit: true
        }
      })
    }
  },
  watch: {
    proposer: {
      immediate: true,
      async handler (val) {
        this.profile = val && await this.getPublicProfile(val)
      }
    },
    title: {
      immediate: true,
      async handler (val) {
        if (val) {
          this.titleHash = await this.toSHA256(val)
          const { image, color } = await this.getAdorableImage(this.titleHash)
          this.avatarSrc = image
          this.avatarColor = color
        }
      }
    }
  }
}
</script>

<template lang="pug">
q-card.role
  .url(v-if="url && url !== 'null'")
    q-btn(
      icon="fas fa-bookmark"
      @click="() => openUrl(url)"
      flat
      color="proposal"
      unelevated
      dense
    )
  top-right-icon(type="role" :menu="true")
  q-btn.card-menu(
    icon="fas fa-ellipsis-v"
    color="grey"
    flat
    dense
    round
    no-caps
    :ripple="false"
    style="width:40px;height:40px;margin: 4px;"
  )
    q-menu
      q-list(dense)
        q-item(
          v-if="account === proposer"
          clickable
          v-close-popup
          @click="editObject"
        )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-pencil-alt" size="14px")
          q-item-section Edit
        q-item(
          clickable
        )
          q-popup-proxy
            .confirm.column.q-pa-sm
              | Are you sure you want to suspend this role?
              q-input(
                v-model="suspendReason"
                label="Reason"
              )
              .row.flex.justify-between.q-mt-sm
                q-btn(
                  color="primary"
                  label="No"
                  dense
                  flat
                  v-close-popup="-1"
                )
                q-btn(
                  color="primary"
                  label="Yes"
                  dense
                  @click="onSuspendRole"
                  v-close-popup="-1"
                )
          q-item-section(style="max-width: 20px;")
            q-icon(name="fas fa-hand-paper" size="14px")
          q-item-section Suspend
  .column.fit.flex.justify-between
    div
      q-card-section.text-center.relative-position(@click="showCardFullContent")
        q-img.avatar(
          v-if="avatarSrc"
          :src="avatarSrc"
          :style="`background: ${avatarColor}`"
        )
        .salary-bucket.bg-proposal(v-if="annualSalary") {{ getSalaryBucket(parseInt(annualSalary)) }}
      q-card-section
        .title(@click="showCardFullContent") {{ title }}
    div
      q-card-actions.q-pa-lg.role-actions
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
.role
  width 300px
  border-radius 1rem
  margin 10px
.role:hover
  z-index 10
  box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
  .avatar, .salary-bucket
    z-index 110
.avatar
  cursor pointer
  border-radius 50% !important
  margin-top 20px
  width 100%
  max-width 150px
  height 150px
.salary-bucket
  position absolute
  bottom 10px
  right 80px
  color white
  font-size 28px
  font-weight 700
  border-radius 50%
  width 45px
.title
  cursor pointer
  text-align center
  font-size 24px
  margin-top 10px
  color $grey-6
  line-height 1.0
.url
  position absolute
  top -4px
  right 80px
  z-index 12
.role-actions
  button
    width 45%
.card-menu
  position absolute
  right 0
  top 7px
  width 20px
  z-index 110
  /deep/.q-focus-helper
    display none !important
</style>
