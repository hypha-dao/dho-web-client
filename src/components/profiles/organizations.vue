<script>

import { truncate } from '~/mixins/truncate'

export default {
  name: 'organizations',
  mixins: [truncate],
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    organizations: {
      type: Array,
      default: undefined
    },

    hasMore: Boolean,
    tablet: Boolean
  },

  methods: {
    onSeeMore () {
      this.$emit('onSeeMore')
    },
    label (name) {
      return name.slice(0, 2).toUpperCase()
    }
  }
}
</script>

<template lang="pug">
widget(:title="$t('profiles.organizations.otherOrganizations')" v-if="tablet" titleNoWrap="titleNoWrap" scrollList="scrollList")
  .dao-container(v-if="organizations && organizations.length")
    template(v-for="(organisation, index) in organizations")
      q-item.list-item.cursor-pointer.row.justify-center.items-center(:key="index" :style="'padding: 0;'" ripple="false" :to="'/' + organisation.url ")
        q-item-section(avatar)
          q-avatar(v-if="organisation.logo" size="xl")
            img(:src="organisation.logo")
          q-avatar(v-else size="xl" color="primary" text-color="white" font-size="24px") {{ label(organisation.name) }}
        q-item-section.text-body1.text-bold.creator(lines="1" :title="organisation.name")
    .flex.flex-center(v-if="true")
      q-btn.q-pa-xs.button(flat size="sm" color="primary" :label="$t('profiles.organizations.seeMore')" v-show="hasMore" @click="onSeeMore")
widget(:title="$t('profiles.organizations.organizations')" v-else)
  q-list(v-if="organizations && organizations.length")
    template(v-for="(organisation, index) in organizations")
      q-item.list-item.q-py-md.q-px-none.cursor-pointer.row.justify-center.items-center(:key="index" :class="index===0 && 'q-mt-md'" ripple="false" :to="'/' + organisation.url ")
        q-item-section(avatar)
          q-avatar(v-if="organisation.logo" size="xl")
            img(:src="organisation.logo")
          q-avatar(v-else size="xl" color="primary" text-color="white" font-size="24px") {{ label(organisation.name) }}
        q-item-section.text-body1.text-bold.creator(lines="1" :title="organisation.name") {{ truncate(organisation.name, 15) }}
        q-btn(round unelevated icon="fas fa-chevron-right" color="inherit" text-color="disabled" size="sm" :ripple="false")
  .q-pt-md.flex.flex-center(v-if="true")
    q-btn.q-pa-xs.button(flat size="sm" color="primary" :label="$t('profiles.organizations.seeMore1')" v-show="hasMore" @click="onSeeMore")

</template>

<style lang="stylus" scoped>
::-webkit-scrollbar
  display: none
.dao-container
  overflow-x scroll
  display flex
  margin-left: 20px
.list-item
  /deep/.q-focus-helper
    display none !important
.button
  /deep/.q-focus-helper
    display none !important
</style>
