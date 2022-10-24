export default {
  methods: {
    hasListener (name) { return this.$listeners[name] !== undefined },
    hasSlot (name) { return this.$slots[name] !== undefined }
  }
}
