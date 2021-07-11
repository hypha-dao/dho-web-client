<script>
/**
 * Renders the individual's avatar or a placeholder
 */
export default {
  name: 'profile-picture',

  props: {
    avatar: String,
    name: String,
    username: String,
    showName: Boolean,
    size: {
      type: String,
      default: '200px'
    },
    tooltip: Boolean,
    link: Boolean
  },

  computed: {
    nameTooltip () {
      return `${this.name ? `${this.name}<br />` : ''}@${this.username}`
    }
  },

  methods: {
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
  q-avatar.on-left(v-if="avatar"
    :size="size"
    :class="{ 'cursor-pointer': link && username }"
    @click="onClick"
  )
    q-img(:src="avatar")
      q-tooltip(v-if="tooltip"
          anchor="top middle"
          self="bottom middle"
          :content-style="{ 'font-size': '1em' }"
        )
          div(v-html="nameTooltip")
  q-avatar.on-left(v-else
    color="accent"
    text-color="white"
    :size="size"
    :class="{ 'cursor-pointer': link && username }"
    @click="onClick"
  ) {{ getNameAbbreviation() }}
    q-tooltip(v-if="tooltip"
      anchor="top middle"
      self="bottom middle"
      :content-style="{ 'font-size': '1em' }"
    )
      div(v-html="nameTooltip")
  div(v-if="showName")
    .text-body1.text-bold {{ name }}
    .text-italic {{ '@' + username }}
</template>
