<script>

export default {
  name: 'comments-input',

  data () {
    return {
      comment: ''
    }
  },

  methods: {
    createComment () {
      if (this.comment.trim() === '') return
      this.$emit('create', { content: this.comment })
      this.comment = ''
    }
  }
}
</script>

<template lang="pug">
.comments-input
    q-input.q-my-md.rounded-border(
        :debounce="200"
        @keyup.enter="createComment"
        bg-color="white"
        color="primary"
        dense
        lazy-rules
        outlined
        placeholder="Type a comment here..."
        ref="name"
        rounded
        v-model="comment"
    )
</template>
