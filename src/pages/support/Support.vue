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
    ...mapGetters('app', ['appVersion']),
    ...mapGetters('dao', ['daoSettings']),
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
      widget(:title="$t('pages.support.support.transactions')")
        .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md {{ $t('pages.support.support.whenYouEncounter') }}
        .text-subtitle1.q-mt-sm.text-bold.q-mt-xl {{ $t('pages.support.support.transactionLog') }}
        q-list.rounded-borders
          template(v-for="(notification, index) in notifications")
            widget.q-py-md.q-px-sm.q-my-md(background="grey-3" noPadding)
              q-item(:key="index")
                q-item-section
                  .text-body2.text-bold.text-capitalize {{ notification.title }}
                  .text-subtitle2.text-red.text-italic(v-if="notification.status === 'error'") {{ notification.error }}
                  .text-subtitle2.text-green.text-italic.text-capitalize(v-if="notification.status === 'success'") {{ notification.status}}
                q-item-section(side v-if="notification.status === 'error'")
                  q-btn(dense flat size="8px" color="primary" icon="fas fa-copy" @click="onCopyToClipboard(notification)")
                  q-tooltip {{ $t('pages.support.support.copyDataReport') }}
                q-item-section(side v-if="notification.status === 'success'")
                  q-btn(dense flat size="8px" color="primary" icon="fas fa-external-link-alt" @click="openUrl(`/transaction/${notification.transactionId}`)" target="_blank")
                  q-tooltip {{ $t('pages.support.support.displayOnBlockExplorer') }}
    .relative-position.q-my-md(:class="{'col-3': $q.screen.gt.md, 'q-pl-sm': $q.screen.gt.md,'col-12': !$q.screen.gt.md}")

      widget(:title="$t('pages.support.support.doYouHaveQuestions')")
        .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md {{ $t('pages.support.support.findOurFull') }}
        q-btn.q-px-xl.q-mt-xl(rounded no-caps color="primary" type="a" :href="daoSettings.documentationURL" target="_blank") {{ $t('pages.support.support.openWiki') }}

      widget.q-mt-md(:title="$t('pages.support.support.version')")
        .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md {{ appVersion  }}

      widget.q-mt-md(title="DAO")
        .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md id: {{ daoSettings.id  }}
        .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md name: {{ daoSettings.title  }}
        .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md uid: {{ daoSettings.name  }}
</template>

<style lang="stylus" scoped>
</style>
