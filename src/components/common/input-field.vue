<script>
export default {
  name: 'input-field',
  props: {
    rules: {
      type: Array,
      default: () => {}
    },
    color: {
      type: String,
      default: 'heading'
    }
  }
}
</script>

<template lang="pug">
q-input(ref="input"
        :color = "color"
        :rules = "rules"
        v-bind = "{...$attrs, ...$props, ...$slots}"
        v-on = "$listeners")
</template>
