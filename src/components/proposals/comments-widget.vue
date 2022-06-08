<script>

export default {
  name: 'comments-widget',

  components: {
    CommentItem: () => import('~/components/proposals/comment-item'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    comments: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      comment: ''
    }
  },

  methods: {
    createComment () {
      try {
        this.$emit('create', { content: this.comment })
        this.comment = ''
      } catch (error) {
      }
    }

  }
}
</script>

<template lang="pug">
widget.comments-widget(:title="`Comments (${comments.length})`")
    template(v-for="(comment, index) in comments")
        comment-item.q-mt-xs(
            :class="{ 'q-mt-xl': index === 0 }"
            @create="(data) => $emit('create', data)"
            @like="$emit('like', comment.id)"
            @unlike="$emit('unlike', comment.id)"
            @load-comment="(id) => $emit('load-comment', id)"
            v-bind='comment'
        )
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
