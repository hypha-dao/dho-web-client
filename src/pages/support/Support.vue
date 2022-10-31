<script>
import { mapGetters } from 'vuex'
import { copyToClipboard } from '~/utils/eosio'
import { Notify } from 'quasar'

export default {
  name: 'page-support',

  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  computed: {
    ...mapGetters('notifications', ['notifications'])
  },

  methods: {
    openUrl (url) {
      window.open(`${process.env.BLOCKCHAIN_EXPLORER}${url}`)
    },

    onCopyToClipboard (error) {
      let str = '```'
      str += `User: ${error.actions[0].authorization[0].actor}\n`
      str += `Error: ${error.error}\n`
      error.actions.forEach((a, i) => {
        str += `Action: ${i}\n`
        str += `Contract: ${a.account}\n`
        str += `Method: ${a.name}\n`
        str += `Data: ${JSON.stringify(a.data)}\n`
      })
      str += '```'
      copyToClipboard(str)

      Notify.create({
        color: 'secondary',
        message: 'Data copied, paste it to the support team',
        position: 'bottom',
        icon: 'fas fa-life-ring',
        timeout: 3000,
        actions: [
          { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
        ]
      })
    }
  }

}
</script>

<template lang="pug">
q-page.page-support
  .row.full-width
    .transactions(:class="{'col-9': $q.screen.gt.md, 'q-px-sm': $q.screen.gt.md, 'col-12': !$q.screen.gt.md, 'q-my-md': $q.screen.gt.md}")
      widget(title="Transactions")
        .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md When you encounter a error message, please copy paste the transaction into the DAO Support Channel.
        .text-subtitle1.q-mt-sm.text-bold.q-mt-xl Transaction Log
        q-list(class="rounded-borders")
          template(v-for="(notification, index) in notifications")
            widget(background="grey-3" noPadding).q-py-md.q-px-sm.q-my-md
              q-item(:key="index")
                q-item-section()
                  .text-body2.text-bold.text-capitalize {{ notification.title }}
                  .text-subtitle2.text-red.text-italic(v-if="notification.status === 'error'") {{ notification.error }}
                  .text-subtitle2.text-green.text-italic.text-capitalize(v-if="notification.status === 'success'") {{ notification.status}}
                q-item-section(side v-if="notification.status === 'error'")
                  q-btn(dense flat size="8px" color="primary" icon="fas fa-copy" @click="onCopyToClipboard(notification)")
                  q-tooltip Copy data report to support team
                q-item-section(side v-if="notification.status === 'success'")
                  q-btn(dense flat size="8px" color="primary" icon="fas fa-external-link-alt" @click="openUrl(`/transaction/${notification.transactionId}`)" target="_blank")
                  q-tooltip Display on block explorer
    .relative-position.q-my-md(:class="{'col-3': $q.screen.gt.md, 'q-pl-sm': $q.screen.gt.md,'col-12': !$q.screen.gt.md}")
      widget(title="Do you have Questions?")
        .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md Find our full documentation here
        q-btn.q-px-xl.q-mt-xl(rounded no-caps color="primary" type="a" href="https://notepad.hypha.earth/5dC66nNXRVGpb1aTHaRJXw" target="_blank") Open wiki
</template>

<style lang="stylus" scoped>
</style>
