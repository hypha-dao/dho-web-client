<script>
/**
 * Renders the individual's avatar, name and account
 */
export default {
  name: 'profile-header',

  props: {
    avatarUrl: String,
    name: String,
    size: String,
    username: String
  },

  computed: {
    nameAbbr () {
      if (this.name) return this.name.slice(0, 2).toUpperCase()
      if (this.username) return this.username.slice(0, 2).toUpperCase()
      return null
    }
  }
}
</script>

<template lang="pug">
.row.q-pa-md.q-col-gutter-md
  .col-12.col-sm-6.col-md-12
    .flex.justify-center.q-my-md
      q-avatar(v-if="avatarUrl" :size="size")
        img(:src="avatarUrl")
      q-avatar(v-else color="accent" text-color="white" :size="size") {{ nameAbbr }}
  .col-12.col-sm-6.col-md-12
    .name.text-h5.text-bold.text-center {{ name ? name : username }}
    .account.text-subtitle1.text-center {{ '@' + username }}
</template>
