<script>
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
        bio: this.bio
      }
    }
  },
  methods: {
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
      this.form = {
        bio: this.bio
      }
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
  )
  q-markdown(:src="bio" v-if="!editable")
  q-editor(v-model="form.bio" v-if="editable")
</template>
