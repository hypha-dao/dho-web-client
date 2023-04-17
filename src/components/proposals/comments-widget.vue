<script>
import { mapGetters } from 'vuex'

export default {
  name: 'comments-widget',

  components: {
    CommentInput: () => import('~/components/proposals/comment-input'),
    CommentItem: () => import('~/components/proposals/comment-item'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    comments: {
      type: Array,
      default: () => []
    },

    disable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['isMember'])
  }
}
</script>

<template lang="pug">
widget.comments-widget(title='Comments')
    .h-h2.text-secondary.absolute(:style="{ 'top': '-10px', 'right': '0' }") {{ comments.length }}
    template(v-for="(comment, index) in comments")
        comment-item.q-mt-xs(
            :class="{ 'q-mt-xl': index === 0 }"
            :disable="disable"
            @create="(data) => $emit('create', data)"
            @like="(id) => $emit('like', id)"
            @unlike="(id) => $emit('unlike', id)"
            @delete="(id) => $emit('delete', id)"
            @load-comment="(id) => $emit('load-comment', id)"
            v-bind='comment'
        )
    comment-input.q-my-md(v-show="!disable" color = "heading" @create="(data) => $emit('create', data)" :disable="!isMember")
</template>
