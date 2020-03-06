<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'layout-left-menu',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember'])
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    displayForm (type) {
      this.setShowRightSidebar(true)
      this.setRightSidebarType(`${type}Form`)
      this.$emit('close')
    }
  }
}
</script>

<template lang="pug">
  q-scroll-area.fit.bg-grey-3
    q-list.menu(
      :bordered="false"
      dense
    )
      q-item
        q-item-section
        q-item-section(side)
          q-btn.close-btn(
            icon="fas fa-times"
            round
            dense
            unelevated
            color="white"
            text-color="black"
            @click="$emit('close')"
          )
      q-item.text-black(to="/")
        q-item-section(avatar)
          q-icon(name="fa fa-home")
        q-item-section
          strong My Actions
      q-item(
        to="/roles"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Apply for Role
      q-separator.q-my-sm
      q-item.text-black(to="/members")
        q-item-section(avatar)
          q-icon(name="fas fa-user-friends")
        q-item-section
          strong Members
      q-item(
        to="/applicants"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Enroll Registrants
      q-separator.q-my-sm
      .flex.justify-between.items-center
        q-item(
          to="/roles"
          :style="{ width: 'calc(100% - 50px)'}"
        )
          q-item-section(avatar)
            q-icon(name="fas fa-suitcase")
          q-item-section
            strong Roles
        q-btn.btn-add(
          v-if="isAuthenticated && isMember"
          color="red"
          text-color="white"
          icon="fas fa-plus"
          round
          dense
          unelevated
          size="xs"
          @click="displayForm('role')"
          :style="{width: '24px', height: '24px'}"
        )
      q-item(
        to="/proposals/role"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Vote on Roles
      q-separator.q-my-sm
      .flex.justify-between.items-center
        q-item(
          to="/payouts"
          :style="{ width: 'calc(100% - 50px)'}"
        )
          q-item-section(avatar)
            q-icon(name="fas fa-money-bill-alt")
          q-item-section
            strong Payouts
        q-btn.btn-add(
          v-if="isAuthenticated && isMember"
          color="red"
          text-color="white"
          icon="fas fa-plus"
          round
          dense
          unelevated
          size="xs"
          @click="displayForm('payout')"
          :style="{width: '24px', height: '24px'}"
        )
      q-item(
        to="/proposals/payout"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Vote on Payouts

</template>

<style lang="stylus" scoped>
.close-btn
  margin-top 10px
.btn-add
  margin-right 17px
.menu
  font-size 16px
</style>
