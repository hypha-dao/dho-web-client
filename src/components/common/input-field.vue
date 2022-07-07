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

<template lang="pug">
q-input(color = "heading"
        ref="input"
        :rules = "rules"
        v-bind = "{...$attrs, ...$props, ...$slots}"
        v-on = "$listeners")
  template(v-slot:prepend)
    slot(name="prepend")
  template(v-slot:append)
    slot(name="append")

</template>
