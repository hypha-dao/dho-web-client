<script>
import { mapGetters } from 'vuex'

export default {
  name: 'options-quests',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  props: {},

  data () {
    return {
      types: [
        {
          label: this.$t('pages.proposals.create.optionsquests.startANewQuest'),
          value: 'queststart'
        },
        {
          label: this.$t('pages.proposals.create.optionsquests.completeAnActiveQuest'),
          value: 'milestone'
        }
      ],

      type: { label: this.$t('pages.proposals.create.optionsquests.select') }
    }
  },

  apollo: {
    quests: {
      query: require('~/query/quests/dao-quest-list.gql'),
      update: data => data.queryQueststart.map(quest => ({
        label: quest.name,
        value: quest.id
      })),
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } }
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),
    hasQuests () { return this.quests.length > 0 },
    isLoading () { return this.$apollo.queries.quests.loading },
    parent: {
      get () { return this.$store.state.proposals.draft.parentId },
      set (value) { this.$store.commit('proposals/setParent', value) }
    }
  },

  watch: {
    type: {
      immediate: true,
      deep: true,
      async handler (type) {
        if (type.value === 'queststart') { this.$emit('select', 'queststart') }
      }
    },

    parent: {
      immediate: true,
      deep: true,
      async handler (type) {
        if (type) { this.$emit('select', 'queststart') }
      }
    }

  }

}
</script>

<template lang="pug">
.options-quests.q-mt-xl
  section(v-if="isLoading")
    .row.justify-center.q-my-md
      loading-spinner(color="primary" size="40px")
  section(v-else)
    .h-h4.q-pt-xl {{ $t('pages.proposals.create.optionsquests.chooseAQuestType') }}
      .row.full-width.q-mt-xs
        .col-6.q-pr-xxs
          q-select.q-mt-xs(:options="types" dense dropdown-icon="fas fa-chevron-down" hide-bottom-space options-dense outlined rounded v-model="type")
        .col-6.q-pl-xxs
          q-select.q-mt-xs(:options="quests" dense dropdown-icon="fas fa-chevron-down" hide-bottom-space options-dense outlined rounded v-if="type.value === 'milestone'" v-model="parent")

</template>

<style lang="stylus" scoped>
</style>
