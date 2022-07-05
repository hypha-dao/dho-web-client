<script>
import { toHTML } from '~/utils/turndown'
/**
 * Renders the provided bio in markdown on a widget.
 */
export default {
  name: 'about',
  components: {
    WidgetEditable: () => import('../common/widget-editable.vue'),
    InputEditor: () => import('~/components/common/input-editor.vue')
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
      this.$emit('onCancel')
    },
    async save (success, fail) {
      this.editable = false
      this.savable = false
      this.$emit('onSave', this.form, success, fail)
    },
    reset () {
      this.form.bio = toHTML(this.bio)
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
  input-editor.full-width.q-mt-xs.rounded-border(
    v-model="form.bio"
    v-if="editable"
    :toolbar="[['bold', 'italic', /*'strike', 'underline'*/],['token', 'hr', 'link', 'custom_btn'],['quote', 'unordered', 'ordered']]"
  )
</template>
