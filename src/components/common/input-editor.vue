<script>
export default {
  name: 'input-editor',
  props: {
    rules: {
      type: Array,
      default: () => {}
    }
  }
}
</script>

<template lang = "pug">
q-editor(:content-style="{ color: '#84878E', fontWeight: 'normal' }"
         color = "heading"
         :rules = "rules"
         v-bind = "{...$attrs, ...$props, ...$slots}"
         v-on = "$listeners")
</template>
