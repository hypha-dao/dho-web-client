<script>
export default {
  name: 'options-archetypes',
  components: {
    ArchetypeRadio: () => import('~/components/archetypes/archetype-radio.vue')
  },

  props: {
    selectedHash: String
  },

  data () {
    return {
      model: null,
      options: null,
      text: null
    }
  },

  apollo: {
    dho: {
      query: require('../../../query/archetypes.gql'),
      update: data => data.getDho,
      variables () {
        return {
          hash: '52a7ff82bd6f53b31285e97d6806d886eefb650e79754784e9d923d3df347c91'
        }
      }
    }
  },

  methods: {
    // TODO: Move this code to shared location?
    archetypes (dho) {
      if (dho.role && Array.isArray(dho.role)) {
        return dho.role
      }
      return []
    },

    filtered (archetype) {
      if (!this.text) return true
      const needle = this.text.toLocaleLowerCase()
      return archetype && archetype.details_title_s.toLocaleLowerCase().indexOf(needle) > -1
    },

    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLocaleLowerCase()
        this.options = this.archetypes(this.dho).map(r => r.details_title_s).filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
      })
    },

    setModel (val) {
      this.model = val
    }
  }
}
</script>

<template lang="pug">
.options-archetypes
  .text-h6.q-pa-sm Choose an archetype
  q-input(outlined v-model="text" label="Filter archetypes")
  // q-select(
    filled
    :value="model"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :options="options"
    @filter="filterFn"
    @input-value="setModel"
    style="width: 250px; padding-bottom: 32px"
  // )
    template(v-slot:no-option)
      q-item
        q-item-section.text-grey No results
  .row
    template(v-for="archetype in archetypes(dho)")
      .col-4.q-pa-sm(v-if="filtered(archetype)")
        archetype-radio(
          :archetype="archetype"
          :selected="archetype.hash===selectedHash"
          @click="$emit('select', archetype.hash)"
        )
</template>
