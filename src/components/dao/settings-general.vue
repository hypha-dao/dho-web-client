<script>
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'settings-general',
  components: {
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
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
  },

  data () {
    return {
      isShowingMore: false
    }
  },

  methods: {
    ipfsy
  }
}
</script>

<template lang="pug">
.tab
  widget(:title="$t('configuration.settings-general.title')" titleImage='/svg/cog.svg' :bar='true').q-pa-none.full-width
    p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-general.description') }}
    .hr.q-my-xl

    section.row.justify-between.q-col-gutter-x-xl
      .col-12.col-md-4(:class="{'q-mt-sm': !$q.screen.gt.md}")
        label.h-label {{ $t('configuration.settings-general.form.logo.label') }}
        .row.items-center
          q-avatar.q-mr-sm(color="primary" text-color="white")
            img(v-show="form.logo" :src="ipfsy(form.logo)")
            span(v-if="!form.logo") {{ form.title ? form.title[0] : form.name ? form.name[0] : '' }}
          .q-my-xs.row.col
            q-btn.full-width.q-px-xl.rounded-border.text-bold(
              :disable="!isAdmin"
              :label="$t('configuration.settings-general.form.upload.label')"
              @click="$refs.logo.chooseFile()"
              color="primary"
              no-caps
              outline
              rounded
              unelevated
            )
            input-file-ipfs(
              @uploadedFile="form.logo = arguments[0]"
              image
              ref="logo"
              v-show="false"
            )
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      .col-12.col-md-4(:class="{'q-mt-sm': !$q.screen.gt.md}")
        label.h-label {{ $t('configuration.settings-general.form.name.label') }}
        q-input.q-my-xs(
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
          v-model='form.name'
        )
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

      .col-12.col-md-4(:class="{'q-mt-sm': !$q.screen.gt.md}")
        label.h-label {{ $t('configuration.settings-general.form.url.label') }}
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

      .full-width.q-mt-sm
        label.h-label {{ $t('configuration.settings-general.form.purpose.label') }}
        q-input.q-my-sm(
          :debounce="200"
          :disable="!isAdmin"
          :input-style="{ 'resize': 'none' }"
          bg-color="white"
          color="accent"
          dense
          lazy-rules
          maxlength="300"
          outlined
          placeholder="Max 140 characters"
          ref="nickname"
          rounded
          rows="6"
          type="textarea"
          v-model='form.purpose'
        )
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

    section.row.justify-between.q-col-gutter-x-xl(v-if="isShowingMore")
        .col-12.col-md-4(:class="{'q-mt-sm': !$q.screen.gt.md}")
            label.h-label {{ $t('configuration.settings-general.form.primary-color.label') }}
            .row.full-width.items-center.q-mt-sm
                .col-auto.q-mr-sm
                    q-avatar(size="40px" :style="{'background': form.primaryColor, 'cursor': 'context-menu'}")
                        q-popup-proxy(v-show="isAdmin" cover transition-show="scale" transition-hide="scale")
                            q-color(:disable="!isAdmin" v-model="form.primaryColor")
                q-input.col(
                    :debounce="200"
                    :disable="!isAdmin"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules
                    maxlength="50"
                    outlined
                    placeholder="#9376GJ9"
                    ref="name"
                    rounded
                    v-model="form.primaryColor"
                )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-4(:class="{'q-mt-sm': !$q.screen.gt.md}")
            label.h-label {{ $t('configuration.settings-general.form.secondary-color.label') }}
            .row.full-width.items-center.q-mt-sm
                .col-auto.q-mr-sm
                    q-avatar(size="40px" :style="{'background': form.secondaryColor, 'cursor': 'context-menu'}")
                        q-popup-proxy(v-show="isAdmin" cover transition-show="scale" transition-hide="scale")
                            q-color(:disable="!isAdmin" v-model="form.secondaryColor")
                q-input.col(
                    :debounce="200"
                    :disable="!isAdmin"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules
                    maxlength="50"
                    outlined
                    placeholder="#9376GJ9"
                    ref="name"
                    rounded
                    v-model="form.secondaryColor"
                )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .col-12.col-md-4(:class="{'q-mt-sm': !$q.screen.gt.md}")
            label.h-label {{ $t('configuration.settings-general.form.text-color.label') }}
            .row.full-width.items-center.q-mt-sm
                .col-auto.q-mr-sm
                    q-avatar(size="40px" :style="{'background': form.textColor, 'border': form.textColor !== '#ffffff' ? '' : '1px solid #A3A5AA', 'cursor': 'context-menu'}")
                        q-popup-proxy(v-show="isAdmin" cover transition-show="scale" transition-hide="scale")
                            q-color(:disable="!isAdmin" v-model="form.textColor")
                q-input.col(
                    :debounce="200"
                    :disable="!isAdmin"
                    bg-color="white"
                    color="accent"
                    dense
                    lazy-rules
                    maxlength="50"
                    outlined
                    placeholder="#9376GJ9"
                    ref="name"
                    rounded
                    v-model="form.textColor"
                )
            q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!isAdmin") Only DAO admins can change the settings

        .row.full-width.q-my-xl.relative-position
          .col-6(:style="{'height':'96px', 'background': form.primaryColor, 'cursor': 'context-menu'}")
          .col-6(:style="{'height':'96px', 'background': form.secondaryColor, 'cursor': 'context-menu'}")
          .absolute.z-50.absolute-center.h-h3.text-weight-500(:style="{'color': form.textColor}") {{ $t('configuration.settings-general.form.sample-text') }}

    footer.full-width.row.items-center.justify-center
      q-btn.q-px-lg(
        :label="isShowingMore ? $t('configuration.settings-general.nav.show-less') : $t('configuration.settings-general.nav.show-more')"
        @click="isShowingMore = !isShowingMore"
        color="primary"
        flat
        no-caps
        rounded
      )

</template>

<style lang="stylus" scoped>
</style>
