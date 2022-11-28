<script>
import { toHTML } from '~/utils/turndown'
import Vue from 'vue'
import VueSanitize from 'vue-sanitize'
Vue.use(VueSanitize)
/**
 * Renders the provided bio in markdown on a widget.
 */
const ABOUT_MAX_LENGTH = 4000

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
      editable: false,
      form: {
        bio: undefined
      },
      ABOUT_MAX_LENGTH: ABOUT_MAX_LENGTH
    }
  },
  created () {
    this.reset()
  },

  methods: {
    openEdit () {
      this.editable = true
      this.$refs.widget.openEdit()
    },
    onEdit () {
      this.editable = true
    },
    cancel () {
      this.editable = false
      this.reset()
      this.$emit('onCancel')
    },
    async save (success, fail) {
      this.editable = false
      this.$emit('onSave', this.form, success, fail)
    },
    reset () {
      this.form.bio = toHTML(this.bio)
    }
  },

  computed: {
    isSavable () {
      return this.$sanitize(this.form.bio, { allowedTags: [] }).length < 4000
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
  :savable= "isSavable"
  ref="widget"
  )
  q-markdown.h-b2(:src="bio" v-if="!editable")
  q-field.full-width.q-mt-xs.rounded-border(
    :rules="[val => this.$sanitize(val, { allowedTags: [] }).length < ABOUT_MAX_LENGTH || `The about text must contain less than ${ABOUT_MAX_LENGTH} characters (your about text contain ${this.$sanitize(form.bio, { allowedTags: [] }).length} characters)`]"
    dense
    maxlength=4000
    ref="bio"
    stack-label
    square
    borderless
    v-model="form.bio"
  )
    input-editor.full-width.q-mt-xs.rounded-border(
      v-model="form.bio"
      v-if="editable"
      :toolbar="[['bold', 'italic', /*'strike', 'underline'*/],['token', 'hr', 'link', 'custom_btn'],['quote', 'unordered', 'ordered']]"
    )
  </template>
