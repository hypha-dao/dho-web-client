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
widget(title='General' titleImage='/svg/file-checkmark.svg' :bar='true').q-pa-none.full-width
    p.text-sm.text-h-gray.leading-loose.q-mt-md Use general settings to set up some basic parameters such as a link to your main collaboration space and your DAO and use the toggle to enable or disable key features.

    .row.justify-between.q-col-gutter-x-md
        .col-12.col-md-6
            .row.items-center.q-col-gutter-xs
                label.h-label DAO name
            q-input.q-my-sm(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                outlined
                placeholder="Paste the URL address here"
                ref="title"
                rounded
                v-model='form.title'
            )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-6
            .row.items-center.q-col-gutter-xs
                label.h-label Custom URL
            .row.items-center
                p.q-mt-md.q-mr-md.subtitle dao.hypha.earth/
                q-input.q-my-sm.col(
                    :debounce="200"
                    :disable="!isAdmin"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules
                    outlined
                    placeholder="Type your custom URL here"
                    ref="name"
                    rounded
                    v-model='form.url'
                )
                    q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

    .row.justify-between.q-mt-sm.q-col-gutter-x-md
        .col-12.col-md-6
            .row.items-center.q-col-gutter-xs
                label.h-label Social chat
            q-input.q-my-sm(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                outlined
                placeholder="Paste the URL address here"
                ref="name"
                rounded
                v-model='form.socialChat'
            )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-3
            .row.items-center.q-col-gutter-xs
                label.h-label Link to documentation
            q-input.q-my-sm(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                outlined
                placeholder="Paste the URL address here"
                ref="name"
                rounded
                v-model='form.documentationURL'
            )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-3
            .row.items-center.q-col-gutter-xs
                label.h-label Button text
            q-input.q-my-sm(
                :debounce="200"
                :disable="!isAdmin"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                outlined
                placeholder="Documentation"
                ref="name"
                rounded
                v-model='form.documentationButtonText'
            )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

    .row.justify-between.q-mt-xl.q-col-gutter-x-md
        .col-12.col-md-6
            .row.items-center.q-col-gutter-xs
                label.h-label Proposals creation
            .row.items-center.justify-between.q-mt-xs
                label.text-xs Activate or deactivate proposal creation.
                q-toggle(:disable="!isAdmin" color="primary" keep-color v-model="form.proposalsCreationEnabled")
                    q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-6
            .row.items-center.q-col-gutter-xs
                label.h-label Members application
            .row.items-center.justify-between.q-mt-xs(:class="{'q-mt-xl': !$q.screen.gt.sm}")
                label.text-xs Activate or deactivate member applications.
                q-toggle(:disable="!isAdmin" color="primary" keep-color v-model="form.membersApplicationEnabled")
                    q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

    .row.justify-between.q-mt-xl.q-col-gutter-x-md
        .col-12.col-md-6
            .row.items-center.q-col-gutter-xs
                label.h-label Removable banners
            .row.items-center.justify-between.q-mt-xs
                label.text-xs Activate or deactivate removable banners.
                q-toggle(:disable="!isAdmin" color="primary" keep-color v-model="form.removableBannersEnabled")
                    q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-6
            .row.items-center.q-col-gutter-xs
                label.h-label Multisig configuration
            .row.items-center.justify-between.q-mt-xs
                label.text-xs Activate or deactivate multisig.
                q-toggle(:disable="!isAdmin" color="primary" keep-color v-model="form.multisigEnabled")
                    q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

</template>

<style lang="stylus" scoped>
</style>
