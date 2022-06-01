<script>
import { date } from 'quasar'

export default {
  name: 'comment-item',
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    id: {
      type: String
    },

    author: {
      type: Object,
      default: () => {}
    },

    content: {
      type: String
    },

    createdDate: {
      type: Date
    },

    numberOfLikes: {
      type: Number
    },

    commentAggregate: {
      type: Object
    },

    replies: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      comment: '',
      showingMore: false,
      state: 'IDLE'
    }
  },

  methods: {
    createComment () {
      this.$emit('create', { parentId: this.id, content: this.comment })
      this.comment = ''
      this.state = 'IDLE'
    },

    loadReplies () {
      this.$emit('load-comment', this.id)
      this.showingMore = true
    }
  },

  computed: {
    hasMore () { return this.commentAggregate.count > 0 },

    isLiked () { return this.numberOfLikes > 0 },

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
    }
  },

  watch: {
    state (value) { this.$emit('state-change', value) }
  }

}
</script>

<template lang="pug">
.comment-item
    .row.justify-between.items-center
        .row
            profile-picture(:username="author" size="40px" limit link)
            div.col.q-ml-sm
                p.q-ma-none.text-heading.text-weight-600 {{ author }}
                .h-b3.text-italic.text-h-gray {{ timeago }}
        div.row
            //- TODO: Uncomment when backend is ready.
            //- div.row.items-center
            //-     span {{numberOfLikes}}
            //-     q-btn(
            //-         @click="$emit('unlike')"
            //-         color="primary"
            //-         flat
            //-         icon="fas fa-heart"
            //-         padding="12px"
            //-         rounded
            //-         size="sm"
            //-         unelevated
            //-         v-show='isLiked'
            //-     )
            //-     q-btn(
            //-         @click="$emit('like')"
            //-         color="primary"
            //-         flat
            //-         icon="far fa-heart"
            //-         padding="12px"
            //-         rounded
            //-         size="sm"
            //-         unelevated
            //-         v-show='!isLiked'
            //-     )
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
      ) show more ({{commentAggregate.count}})

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
                @load-comment="(id) => $emit('load-comment', id)"
                v-bind='comment'
            )
    .col.q-pl-xxl(v-show="state==='COMMENTING'")
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
