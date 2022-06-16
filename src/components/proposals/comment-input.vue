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
    },

    insert (emoji) {
      const input = this.$refs.input.$refs.input
      // filter:
      // if (0 == insert) {
      //   return;
      // }
      // if (0 == cursorPos) {
      //   return;
      // }

      // get cursor's position:
      const startPos = input.selectionStart
      const endPos = input.selectionEnd
      let cursorPos = startPos
      const tmpStr = input.value

      // insert:
      this.comment = tmpStr.substring(0, startPos) + emoji + tmpStr.substring(endPos, tmpStr.length)

      // move cursor:
      setTimeout(() => {
        cursorPos += emoji.length
        input.selectionStart = input.selectionEnd = cursorPos
      }, 10)
    }
  }
}
</script>

<template lang="pug">
.comments-input
    q-input.rounded-border(
        :debounce="200"
        @keyup.enter="createComment"
        bg-color="white"
        color="primary"
        dense
        lazy-rules
        outlined
        placeholder="Type a comment here..."
        ref="input"
        rounded
        v-model="comment"
    )
</template>
