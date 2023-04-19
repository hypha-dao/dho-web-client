<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'input-editor',
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
})
</script>

<template lang="pug">
q-editor(
  :color="color"
  :content-style="{color: '#84878E', fontWeight: 'normal'}"
  :rules="rules"
  v-bind="{...$attrs, ...$props, ...$slots}"
  v-on="$listeners"
)
</template>
