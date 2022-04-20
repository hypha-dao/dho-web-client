<script>
export default {
  name: 'options-archetypes',
  components: {
    ArchetypeRadio: () => import('~/components/archetypes/archetype-radio.vue')
  },

  props: {
    reference: Object
  },

  data () {
    return {
      options: null,
      text: null
    }
  },

  apollo: {
    dao: {
      query: require('../../../query/archetypes/dao-archetypes.gql'),
      update: data => data.getDao,
      variables () {
        return {
          daoId: this.$store.state.dao.docId,
          filter: { details_state_s: { regexp: '/.*approved*./i' } },
          order: { asc: 'details_title_s' }
        }
      }
    }
  },

  methods: {
    // TODO: Move this code to shared location?
    archetypes (dao) {
      if (dao && dao.role && Array.isArray(dao.role)) {
        return dao.role.sort((a, b) => a.details_title_s.localeCompare(b.details_title_s))
      }
      return []
    },

    filtered (archetype) {
      if (!this.text) return true
      if (this.reference && archetype.hash === this.reference.hash) return true
      const needle = this.text.toLocaleLowerCase()
      return archetype && archetype.details_title_s.toLocaleLowerCase().indexOf(needle) > -1
    },

    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLocaleLowerCase()
        this.options = this.archetypes(this.dao).map(r => r.details_title_s).filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
      })
    },

    selectArchetype (archetype) {
      this.$emit('select', archetype)
    }
  }
}
</script>

<template lang="pug">
.options-archetypes.q-mt-md
  .h-h4.q-py-sm.q-mt-sm Choose a role archetype and a complexity band
  q-input.q-mt-xxs.rounded-border(
        dense
        label="Filter archetypes"
        outlined
        v-model="text"
  )
  .row.q-mt-sm
    template(v-for="archetype in archetypes(dao)")
      .col-4.q-pa-sm(v-if="filtered(archetype)")
        archetype-radio(
          :archetype="archetype"
          :selected="reference && archetype.docId === reference.docId"
          @click="selectArchetype"
        )
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
