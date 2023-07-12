<script>
import { mapActions } from 'vuex'
import helpers from '~/mixins/helpers'
/**
 * Renders the individual's avatar or a placeholder
 */
export default {
  name: 'profile-picture',
  mixins: [helpers],

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
    ellipsisName: Boolean,
    profilesCount: String,
    noMargins: Boolean,
    boldName: Boolean,
    withoutItalic: Boolean,
    textWhite: Boolean
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

    async getAvatar(forceUpdate) {
      if (this.textOnly) {
        return
      }
      if (this.url) {
        this.avatar = this.url
        return
      }

      if (this.username) {
        const uname = this.username
        const res = await this.loadAvatar(uname)
        if (uname === this.username) {
          this.avatar = res.avatar
          this.name = res.name
        }
      }
    },

    async loadAvatar(username, forceUpdate) {
      this.errorCount = 0
      const profile = await this.getPublicProfile({ username, forceUpdate })
      if (profile) {
        return {
          avatar: profile.publicData.avatar,
          name: profile.publicData.name || username
        }
      } else {
        return {
          avatar: null,
          name: username
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
.row.items-center(:class="{ 'cursor-pointer': link && username }" @click="onClick")
  q-avatar(v-if="avatar && !textOnly" :size="size" :class="{ 'cursor-pointer': link && username, 'q-mr-md': showName && !lightName && !noMargins }")
    q-img(:src="avatar" @error="onImageError")
      q-tooltip(v-if="tooltip" anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }")
        div(v-html="nameTooltip")
    q-badge(v-if="badge" floating rounded color="red" :label="badge")
  q-avatar(v-else color="secondary" text-color="white" :size="size" :class="{ 'cursor-pointer': link && username, 'q-mr-xxs': showName && !noMargins }") {{ getNameAbbreviation() }}

    q-badge(v-if="badge" floating rounded color="red" :label="badge")
    q-tooltip(v-if="tooltip" anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }")
      div(v-html="nameTooltip")
  .q-ml-xs(v-if="showName || showUsername || detail" :style="{ 'display': 'grid' }")
    .text-bold(v-if="showName && !lightName" :class="{ 'text-external-bg': textWhite, 'one-line': limit, 'text-no-wrap': noWrapName, 'ellipsis overflow-hidden': ellipsisName, 'h-h6': boldName, 'h-label': !boldName }") {{ name }}

      q-tooltip {{name}}
    .text-body2.text-italic.text-body.q-ml-xxs(v-if="showName && lightName" :class="{ 'text-external-bg': textWhite }") {{ name }}

      q-tooltip {{name}}
    div(class="text-body2 { 'text-body': !textWhite, 'text-external-bg': textWhite, 'q-ml-xxs': !noMargins, 'text-italic': !withoutItalic }" v-if="showUsername") {{ '@' + username }}

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
