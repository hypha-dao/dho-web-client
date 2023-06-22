<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Editable controls for a widget
 */
export default defineComponent({
  name: 'edit-controls',
  props: {
    /**
     * If true, the save button will be enabled
     */
    savable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editing: false
    }
  },
  computed: {},
  methods: {
    onEdit() {
      this.editing = true
      this.$emit('onEdit')
    },
    onCancel() {
      this.editing = false
      this.$emit('onCancel')
    },
    onSave() {
      this.editing = false
      this.$emit('onSave')
    }
  }
})
</script>

<template lang="pug">
.row
  .col(v-if="!editing")
    q-btn(@click="onEdit" color="primary" flat="flat" icon="fas fa-pen" round="round" size="sm")
      q-tooltip {{ $t('common.edit-controls.edit') }}
  .col(v-if="editing")
    q-btn(@click="onCancel" color="black" flat="flat" icon="fas fa-times" round="round" size="sm")
      q-tooltip {{ $t('common.edit-controls.cancel') }}
  .col(v-if="editing")
    q-btn(:disable="!savable" @click="onSave" color="green" flat="flat" icon="fas fa-check" round="round" size="sm")
      q-tooltip(v-if="savable") {{ $t('common.edit-controls.save') }}
</template>

<style lang="stylus" scoped></style>
