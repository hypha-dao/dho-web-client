<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'comment-item',
  components: {
    CommentInput: () => import('~/components/proposals/comment-input'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    disable: {
      type: Boolean
    },

    id: {
      type: String
    },

    author: {
      type: String,
      default: undefined
    },

    content: {
      type: String
    },

    createdDate: {
      type: String
    },

    commentAggregate: {
      type: Object
    },

    reactions: {
      type: Object,
      default: () => {}
    },

    replies: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      showingMore: false,
      state: 'IDLE',
      user: {}
    }
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile']),

    loadReplies () {
      this.$emit('load-comment', this.id)
      this.showingMore = true
    },

    async loadProfile (username) {
      // TODO: This can be optimized by caching the public profile in the store
      const user = await this.getPublicProfile({ username })
      if (user) {
        this.user = {
          avatar: user.publicData.avatar,
          name: user.publicData.name
        }
      }
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),

    hasMore () { return this.commentAggregate?.count > 0 },

    hasLiked () { return this.reactions ? this.reactions.users?.includes(this.author) : false },

    numberOfLikes () { return this.reactions ? this.reactions.count : 0 },

    timeago () {
      const TODAY = new Date()
      const created = new Date(this.createdDate)

      const second = date.getDateDiff(TODAY, created, 'seconds')
      const minute = date.getDateDiff(TODAY, created, 'minutes')
      const hour = date.getDateDiff(TODAY, created, 'hours')
      const day = date.getDateDiff(TODAY, created, 'days')
      const month = date.getDateDiff(TODAY, created, 'months')
      const year = date.getDateDiff(TODAY, created, 'years')

      if (year > 0) return `${year} year${year > 1 ? 's' : ''} ago`
      if (month > 0) return `${month} month${month > 1 ? 's' : ''} ago`
      if (day > 0) return `${day} day${day > 1 ? 's' : ''} ago`
      if (hour > 0) return `${hour} hour${hour > 1 ? 's' : ''} ago`
      if (minute > 0) return `${minute} minute${minute > 1 ? 's' : ''} ago`
      if (second > 0) return `${second} second${second > 1 ? 's' : ''} ago`

      return ''
    },

    isCreator () {
      return this.author === this.account
    }

  },

  watch: {
    state (value) { this.$emit('state-change', value) },

    author: {
      handler: function (value) {
        this.loadProfile(value)
      },
      immediate: true
    }

  },

  updated () {
  }
}
</script>

<template lang="pug">
.comment-item
    .row.justify-between.items-center
        .row
            profile-picture(:username="author" :url="user.avatar" size="40px" limit link)
            div.col.q-ml-sm
                p.q-ma-none.text-heading.text-weight-600 {{ user.name }}
                .h-b3.text-italic.text-h-gray {{ timeago }}
        div.row
            div.row.items-center
                span {{numberOfLikes}}
                q-btn(
                    @click="$emit('unlike', id)"
                    color="primary"
                    flat
                    icon="fas fa-heart"
                    padding="12px"
                    rounded
                    size="sm"
                    unelevated
                    v-show='hasLiked'
                )
                q-btn(
                    @click="$emit('like', id)"
                    color="primary"
                    flat
                    icon="far fa-heart"
                    padding="12px"
                    rounded
                    size="sm"
                    unelevated
                    v-show='!hasLiked'
                )
            div
                q-btn(
                    @click="state==='COMMENTING' ? state='IDLE' : state='COMMENTING' "
                    color="primary"
                    flat
                    icon="fas fa-share"
                    padding="12px"
                    rounded
                    size="sm"
                    unelevated
                )
                q-btn(
                    @click="$emit('delete', id)"
                    v-if="isCreator"
                    color="primary"
                    flat
                    icon="fa fa-trash"
                    padding="12px"
                    rounded
                    size="sm"
                    unelevated
                )
    .row.q-mt-md
        p {{ content }}

    .row.justify-end(v-show="hasMore")
      q-btn(
        v-show="!showingMore"
          @click="loadReplies"
          color="primary"
          flat
          padding="12px"
          rounded
          size="sm"
          unelevated
      ) show more ({{commentAggregate && commentAggregate.count}})

      q-btn(
        v-show="showingMore"
          @click="showingMore = false"
          color="primary"
          flat
          padding="12px"
          rounded
          size="sm"
          unelevated
      ) show less

    .col.q-pl-xxl
      template(v-for="comment in replies" v-show="showingMore")
            comment-item.q-my-sm(
              v-show="showingMore"
                @create="(data) => $emit('create', data)"
                @like="$emit('like', comment.id)"
                @unlike="$emit('unlike', comment.id)"
                @delete="$emit('delete', comment.id)"
                @load-comment="(id) => $emit('load-comment', id)"
                v-bind='comment'
            )
    .col.q-pl-xxl(v-show="state==='COMMENTING'")
      comment-input.q-my-md(v-show="!disable" @create="({content}) => $emit('create', { parentId: this.id, content })")
</template>
