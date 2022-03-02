<script>
import showdown from 'showdown'

/**
 * Renders the provided bio in markdown on a widget.
 */
export default {
  name: 'about',
  components: {
    WidgetEditable: () => import('../common/widget-editable.vue')
  },

  props: {
    bio: String,
    editButton: Boolean
  },
  data () {
    return {
      savable: true,
      editable: false,
      form: {
        bio: undefined
      }
    }
  },
  created () {
    this.reset()
  },
  methods: {
    openEdit () {
      this.editable = true
      this.savable = true
      this.$refs.widget.openEdit()
    },
    onEdit () {
      this.editable = true
      this.savable = true
    },
    cancel () {
      this.editable = false
      this.reset()
    },
    async save (success, fail) {
      this.editable = false
      this.savable = false
      this.$emit('onSave', this.form, success, fail)
    },
    reset () {
      const converter = new showdown.Converter()
      this.form.bio = converter.makeHtml(this.bio)
    }
  }
}
</script>

<template lang="pug">
widget-editable(
  title="About"
  :editable = "editButton"
  @onCancel="cancel"
  @onEdit="onEdit"
  @onSave="save"
  @onFail="reset"
  :savable= "savable"
  ref="widget"
  )
  q-markdown.h-b2(:src="bio" v-if="!editable")
  q-editor(v-model="form.bio" v-if="editable")
</template>
