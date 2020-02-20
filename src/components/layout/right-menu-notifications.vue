<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'right-menu-notifications',
  computed: {
    ...mapGetters('notifications', ['notifications'])
  },
  methods: {
    ...mapMutations('notifications', ['clearNotifications']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    openUrl (url) {
      window.open(`${process.env.BLOCKCHAIN_EXPLORER}${url}`)
    },
    onClear () {
      this.clearNotifications()
      this.onClose()
    },
    onClose () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  }
}
</script>

<template lang="pug">
.column.justify-between.full-height
  q-list.notif-list(separator)
    q-item
      q-item-section.text-center
        strong Transactions
      q-item-section(side="right")
        q-btn(
          icon="fas fa-times"
          flat
          @click="onClose"
        )
    q-item(
      v-if="notifications.length"
      v-for="notification in notifications"
      :key="notification.id"
      :class="{'new-success': !notification.read && notification.status === 'success', 'new-error': !notification.read && notification.status === 'error'}"
    )
      q-item-section(avatar)
        q-icon(
          :name="notification.icon"
          size="xs"
          :color="notification.status === 'success' ? 'green' : 'red'"
        )
      q-item-section.notif-content
        q-item-label(overline) {{ notification.title }}
        q-item-label(caption) {{ notification.status === 'success' ? notification.content : notification.error }}
      q-item-section(
        v-if="notification.transactionId"
        side
      )
        q-btn(
          color="primary"
          icon="fas fa-external-link-alt"
          @click="openUrl(`/transaction/${notification.transactionId}`)"
          target="_blank"
          dense
          flat
          size="8px"
        )
          q-tooltip Display on block explorer
  q-btn.full-width(
    label="Clear all"
    color="primary"
    :style="{borderRadius: 0}"
    @click="onClear"
  )
</template>

<style lang="stylus" scoped>
.new-success
  background rgba(0, 255, 0, 0.1)
.new-error
  background rgba(255, 0, 0, 0.1)
.notif-content
  max-width 180px
  word-wrap break-word
.notif-list
  height calc(100% - 37px)
  overflow auto
</style>
