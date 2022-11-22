<script>
import { mapActions } from 'vuex'

/**
 * Renders the individual's avatar or a placeholder
 */
export default {
  name: 'profile-picture',

  props: {
    url: String,
    // avatar: String,
    // name: String,
    username: String,
    textOnly: Boolean,
    showName: Boolean,
    lightName: Boolean,
    showUsername: Boolean,
    size: {
      type: String,
      default: '200px'
    },
    tooltip: Boolean,
    underline: {
      type: Boolean,
      default: true
    },
    link: Boolean,
    badge: String,
    detail: String,
    limit: Boolean,
    noWrapName: Boolean,
    ellipsisName: Boolean
  },

  data () {
    return {
      name: null,
      avatar: null,
      errorCount: 0
    }
  },

  computed: {
    nameTooltip () {
      return `${this.name ? `${this.name}<br />` : ''}@${this.username}`
    }
  },

  watch: {
    url: {
      handler: async function () {
        this.getAvatar()
      },
      immediate: true
    },
    username: {
      handler: async function () {
        this.getAvatar()
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile']),

    reload () {
      this.getAvatar()
    },

    onImageError () {
      if (this.errorCount < 1) {
        this.getAvatar(true) // We could remove this if the resource TTL is removed on the server
      } else {
        this.avatar = undefined
      }
      this.errorCount++
    },

    async getAvatar (forceUpdate) {
      if (this.textOnly) {
        return
      }
      if (this.url) {
        this.avatar = this.url
        return
      }

      if (this.username) {
        this.avatar = null
        this.name = this.username
        this.errorCount = 0
        const profile = await this.getPublicProfile({ username: this.username, forceUpdate })
        if (profile) {
          this.avatar = profile.publicData.avatar
          this.name = profile.publicData.name || this.username
        }
      }
    },

    getNameAbbreviation () {
      if (this.name) return this.name.slice(0, 2).toUpperCase()
      if (this.username) return this.username.slice(0, 2).toUpperCase()
      return null
    },

    onClick () {
      if (this.link && this.username) {
        this.$router.push({ path: `/${this.$route.params.dhoname}/@${this.username}` })
      }
    }
  }
}
</script>

<template lang="pug">
.row.items-center.no-wrap(:class="{ 'cursor-pointer': link && username }" @click="onClick")
  q-avatar(v-if="avatar && !textOnly"
    :size="size"
    :class="{ 'cursor-pointer': link && username, 'q-mr-md': showName && !lightName }"
  )
    q-img(:src="avatar" @error="onImageError")
      q-tooltip(v-if="tooltip"
          anchor="top middle"
          self="bottom middle"
          :content-style="{ 'font-size': '1em' }"
        )
          div(v-html="nameTooltip")
    q-badge(v-if="badge" floating rounded color="red" :label="badge")
  q-avatar(v-else
    color="secondary"
    text-color="white"
    :size="size"
    :class="{ 'cursor-pointer': link && username, 'q-mr-md': showName }"
  ) {{ getNameAbbreviation() }}
    q-badge(v-if="badge" floating rounded color="red" :label="badge")
    q-tooltip(v-if="tooltip"
      anchor="top middle"
      self="bottom middle"
      :content-style="{ 'font-size': '1em' }"
    )
      div(v-html="nameTooltip")
  div.q-my-xs.q-ml-xs(v-if="showName || showUsername || detail" :style="{ 'display': 'grid' }")
    .h-label.text-bold(v-if="showName && !lightName" :class="{ 'one-line': limit, 'text-no-wrap': noWrapName, 'ellipsis overflow-hidden': ellipsisName }") {{ name }}
      q-tooltip {{name}}
    .text-body2.text-italic.text-body.q-ml-xxs(v-if="showName && lightName") {{ name }}
      q-tooltip {{name}}
    .text-body2.text-italic.text-body.q-ml-xxs(v-if="showUsername") {{ '@' + username }}
      q-tooltip {{'@' + username}}
    .h-b3.text-italic.text-heading(v-if="detail") {{ detail }}
    slot(name="detail")
</template>

<style lang="stylus" scoped>
.one-line
  overflow: hidden
  display: -webkit-box
  -webkit-box-orient: vertical
  -webkit-line-clamp: 1
  max-width: 100px
  word-break: break-all
</style>
