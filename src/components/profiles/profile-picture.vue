<script>
import { mapActions } from 'vuex'

/**
 * Renders the individual's avatar or a placeholder
 */
export default {
  name: 'profile-picture',

  props: {
    // avatar: String,
    // name: String,
    username: String,
    textOnly: Boolean,
    showName: Boolean,
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
    detail: String
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
    username: {
      handler: async function () {
        this.getAvatar()
      },
      immediate: true
    }
  },

  created () {
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile']),

    reload () {
      this.getAvatar()
    },

    onImageError () {
      if (this.errorCount === 0) {
        this.getAvatar(true) // We could remove this if the resource TTL is removed on the server
      } else {
        this.avatar = undefined
      }
      this.errorCount++
    },

    async getAvatar (forceUpdate = false) {
      if (this.username) {
        this.avatar = null
        this.name = null
        this.errorCount = 0
        const profile = await this.getPublicProfile(this.username, forceUpdate)
        if (profile) {
          this.avatar = profile.publicData.avatar
          this.name = profile.publicData.name
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
        this.$router.push({ path: `@${this.username}` })
      }
    }
  }
}
</script>

<template lang="pug">
.row.items-center
  q-avatar(v-if="avatar && !textOnly"
    :size="size"
    :class="{ 'cursor-pointer': link && username, 'q-mr-md': showName }"
    @click="onClick"
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
    @click="onClick"
  ) {{ getNameAbbreviation() }}
    q-badge(v-if="badge" floating rounded color="red" :label="badge")
    q-tooltip(v-if="tooltip"
      anchor="top middle"
      self="bottom middle"
      :content-style="{ 'font-size': '1em' }"
    )
      div(v-html="nameTooltip")
  div.q-ma-xs(v-if="showName || showUsername || detail")
    .text-subtitle1.text-bold(v-if="showName") {{ name }}
    .text-body2.text-italic.text-grey-6(v-if="showUsername") {{ '@' + username }}
    .text-body2.text-italic.text-grey-6(v-if="detail") {{ detail }}
    slot(name="detail")
</template>
