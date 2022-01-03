<script>
export default {
  name: 'step-description',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    fields: Object
  },

  data () {
    return {
      toolbar: [
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'underline', 'strike'],
        ['undo', 'redo']
      ]
    }
  },

  computed: {
    title: {
      get () {
        return this.$store.state.proposals.draft.title || ''
      },

      set (value) {
        this.$store.commit('proposals/setTitle', value)
      }
    },

    description: {
      get () {
        return this.$store.state.proposals.draft.description || ''
      },

      set (value) {
        this.$store.commit('proposals/setDescription', value)
      }
    },

    url: {
      get () {
        return this.$store.state.proposals.draft.url || ''
      },

      set (value) {
        this.$store.commit('proposals/setUrl', value)
      }
    }
  }
}
</script>

<template lang="pug">
widget
  .q-mt-md
  .q-mb-lg(v-if="fields.title")
    .text-h6 {{ fields.title.label }}
    q-input.q-my-sm.rounded-border(
      v-model="title"
      outlined
      lazy-rules
      :rules="[val => !!val || 'Title is required']"
    )
  .q-mb-lg(v-if="fields.description")
    .text-h6 {{ fields.description.label }}
    q-editor.q-my-sm(
        v-model="description"
        min-height="100px"
        :toolbar="toolbar"
      )
  .q-mb-lg(v-if="fields.url")
    .text-h6 {{ fields.url.label }}
    q-input.q-my-sm.rounded-border(v-model="url" outlined)
  .next-step.q-py-md
    .row.justify-between
      .nothing
      .buttons
        q-btn.q-px-md.q-mr-md(no-caps rounded flat color="primary" label="Prev step" @click="$emit('prev')")
        q-btn.q-px-md(no-caps rounded :disable="title.length === 0" color="primary" label="Next step" @click="$emit('next')")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
