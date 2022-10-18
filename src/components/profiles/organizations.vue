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
widget(title="Other organizations" v-if="tablet" titleNoWrap scrollList)
  .dao-container(v-if="organizations && organizations.length")
    template(v-for="(organisation, index) in organizations")
      q-item(:key="index" :style="'padding: 0;'" ripple="false" :to="'/' + organisation.url ").list-item.cursor-pointer.row.justify-center.items-center
        q-item-section(avatar)
          q-avatar(v-if = "organisation.logo" size="xl")
            img(:src="organisation.logo")
          q-avatar(v-else size="xl" color="primary" text-color="white" font-size='24px') {{ label(organisation.name) }}

        q-item-section.text-body1.text-bold.creator(lines="1" :title="organisation.name")
        //- q-btn(round unelevated icon="fas fa-chevron-right" color="inherit" text-color="disabled" size="sm" :ripple="false" )
    .flex.flex-center(v-if="true")
        q-btn.q-pa-xs(
          flat size="sm"
          color="primary"
          label="See more"
          v-show="hasMore"
          @click="onSeeMore"
        ).button
widget(title="Organizations" v-else)
  q-list(v-if="organizations && organizations.length")
    template(v-for="(organisation, index) in organizations")
      q-item(:key="index" :class="index===0 && 'q-mt-md'" ripple="false" :to="'/' + organisation.url ").list-item.q-py-md.q-px-none.cursor-pointer.row.justify-center.items-center
        q-item-section(avatar)
          q-avatar(v-if = "organisation.logo" size="xl")
            img(:src="organisation.logo")
          q-avatar(v-else size="xl" color="primary" text-color="white" font-size='24px') {{ label(organisation.name) }}

        q-item-section.text-body1.text-bold.creator(lines="1" :title="organisation.name") {{ truncate(organisation.name, 15) }}
        q-btn(round unelevated icon="fas fa-chevron-right" color="inherit" text-color="disabled" size="sm" :ripple="false" )
  .q-pt-md.flex.flex-center(v-if="true")
      q-btn.q-pa-xs(
        flat size="sm"
        color="primary"
        label="See more"
        v-show="hasMore"
        @click="onSeeMore"
      ).button
</template>

<style lang="stylus" scoped>
::-webkit-scrollbar {
  display: none;
}
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
