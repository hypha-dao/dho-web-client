<script>

export default {
  name: 'settings-general',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    form: {
      type: Object,
      default: () => {}
    },

    isAdmin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template lang="pug">
widget.q-pa-none.full-width(:title="$t('dao.settings-general.general')" titleImage="/svg/file-checkmark.svg" :bar="true")
  p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('dao.settings-general.useGeneralSettings') }}
  .row.justify-between.q-col-gutter-x-md
    .col-12.col-md-6
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-general.daoName') }}
      q-input.q-my-sm(:debounce="200" :disable="!isAdmin" bg-color="white" color="accent" dense lazy-rules outlined :placeholder="$t('dao.settings-general.pasteTheUrl')" ref="title" rounded v-model="form.title")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-general.onlyDaoAdmins') }}
    .col-12.col-md-6
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-general.customUrl') }}
      .row.items-center
        p.q-mt-md.q-mr-md.subtitle {{ $t('dao.settings-general.daohyphaearth') }}
        q-input.q-my-sm.col(:debounce="200" :disable="!isAdmin" bg-color="white" color="accent" dense lazy-rules outlined :placeholder="$t('dao.settings-general.typeYourCustom')" ref="name" rounded v-model="form.url")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-general.onlyDaoAdmins1') }}
  .row.justify-between.q-mt-sm.q-col-gutter-x-md
    .col-12.col-md-6
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-general.socialChat') }}
      q-input.q-my-sm(:debounce="200" :disable="!isAdmin" bg-color="white" color="accent" dense lazy-rules outlined :placeholder="$t('dao.settings-general.pasteTheUrl1')" ref="name" rounded v-model="form.socialChat")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-general.onlyDaoAdmins2') }}
    .col-12.col-md-3
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-general.linkToDocumentation') }}
      q-input.q-my-sm(:debounce="200" :disable="!isAdmin" bg-color="white" color="accent" dense lazy-rules outlined :placeholder="$t('dao.settings-general.pasteTheUrl2')" ref="name" rounded v-model="form.documentationURL")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-general.onlyDaoAdmins3') }}
    .col-12.col-md-3
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-general.buttonText') }}
      q-input.q-my-sm(:debounce="200" :disable="!isAdmin" bg-color="white" color="accent" dense lazy-rules outlined :placeholder="$t('dao.settings-general.documentation')" ref="name" rounded v-model="form.documentationButtonText")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-general.onlyDaoAdmins4') }}
  .row.justify-between.q-mt-xl.q-col-gutter-x-md
    .col-12.col-md-6
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-general.proposalsCreation') }}
      .row.items-center.justify-between.q-mt-xs
        label.text-xs {{ $t('dao.settings-general.activateOrDeactivate') }}
        q-toggle(:disable="!isAdmin" color="primary" keep-color="keep-color" v-model="form.proposalsCreationEnabled")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-general.onlyDaoAdmins5') }}
    .col-12.col-md-6
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-general.membersApplication') }}
      .row.items-center.justify-between.q-mt-xs(:class="{'q-mt-xl': !$q.screen.gt.sm}")
        label.text-xs {{ $t('dao.settings-general.activateOrDeactivate1') }}
        q-toggle(:disable="!isAdmin" color="primary" keep-color="keep-color" v-model="form.membersApplicationEnabled")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-general.onlyDaoAdmins6') }}
  .row.justify-between.q-mt-xl.q-col-gutter-x-md
    .col-12.col-md-6
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-general.removableBanners') }}
      .row.items-center.justify-between.q-mt-xs
        label.text-xs {{ $t('dao.settings-general.activateOrDeactivate2') }}
        q-toggle(:disable="!isAdmin" color="primary" keep-color="keep-color" v-model="form.removableBannersEnabled")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-general.onlyDaoAdmins7') }}
    .col-12.col-md-6
      .row.items-center.q-col-gutter-xs
        label.h-label {{ $t('dao.settings-general.multisigConfiguration') }}
      .row.items-center.justify-between.q-mt-xs
        label.text-xs {{ $t('dao.settings-general.activateOrDeactivateMultisig') }}
        q-toggle(:disable="!isAdmin" color="primary" keep-color="keep-color" v-model="form.multisigEnabled")
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") {{ $t('dao.settings-general.onlyDaoAdmins8') }}

</template>

<style lang="stylus" scoped>
</style>
