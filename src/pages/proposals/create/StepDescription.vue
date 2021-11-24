<script>
export default {
  name: 'step-description',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    config: Object,
    draft: Object,
    selection: String,
    stepIndex: Number
  },

  data () {
    return {
      description: '',
      form: {},
      toolbar: [
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'underline', 'strike'],
        ['undo', 'redo']
      ]
    }
  },

  computed: {
    fields () {
      const result = Object.assign({}, this.config.fields)
      const topOption = this.config.options[this.top]
      if (topOption) {
        Object.assign(result, topOption.fields)
        const subOption = topOption.options[this.sub]
        if (subOption) {
          Object.assign(result, subOption.fields)
        }
      }
      // Filter options to just this step
      return Object.values(result).filter(f => f.step === this.stepKey)
    },

    stepKey () {
      return this.config.steps[this.stepIndex].key
    },

    top () {
      return this.selection.split(':')[0]
    },

    sub () {
      const selects = this.selection.split(':')
      if (selects.length > 1) {
        return selects[1]
      }
      return null
    }
  }

  // created () {
  //   const form = {}
  //   this.fields.forEach((field) => {
  //     form[field.key] = this.proposal[field.key]
  //   })
  //   this.form = form
  // }
}
</script>

<template lang="pug">
widget
  .q-mt-md
  template(v-for="field in fields")
    .q-mb-lg
      .text-h6 {{ field.label }}
      q-input.q-my-sm(v-if="field.type === 'string'" outlined :placeholder="field.label")
      q-editor.q-my-sm(v-else-if="field.type === 'markdown'"
        v-model="description"
        min-height="100px"
        :toolbar="toolbar"
      )
  .next-step.q-py-md
    .row.justify-between
      .nothing
      q-btn.q-px-md(no-caps rounded color="primary" label="Next step" @click="$emit('next')")
</template>
