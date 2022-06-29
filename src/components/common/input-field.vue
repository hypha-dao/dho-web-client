<script>
export default {
  name: 'input-field',
  props: {
    rules: {
      type: Array,
      default: () => {}
    }
  }
}
</script>

<template lang = "pug">
q-input(color = "heading"
        :rules = "rules"
        v-bind = "{...$attrs, ...$props, ...$slots}"
        v-on = "$listeners")
</template>
