<script>
export default {
  name: 'layout-footer',
  data () {
    return {
      urls: {
        hypha: 'https://project.hypha.earth',
        slack: 'https://join.slack.com/t/hypha-seeds/shared_invite/enQtMzIzNTAzNDc3OTM3LTFmZjlkYTI3NTQ4NWZmZTcwZDdlYzYwZTNkM2JkMzU4NDJmMmNjZTRlYzk4NjlhNzJkODUyOGI0MjUwZWMzMjg',
        telegram: 'https://t.me/seedscommunity',
        more: 'https://telos.eosx.io/account/hyphadaomain'
      }
    }
  },
  methods: {
    open (type) {
      window.open(this.urls[type], '_blank')
    }
  }
}
</script>

<template lang="pug">
q-toolbar.bg-primary
  q-toolbar-title.flex.justify-end
    q-btn(
      color="white"
      label="PROJECT"
      flat
      icon="img:https://img.icons8.com/color/48/000000/project.png"
      @click="open('hypha')"
    )
    q-btn(
      color="white"
      label="SLACK"
      flat
      icon="img:https://img.icons8.com/ultraviolet/40/000000/slack.png"
      @click="open('slack')")
    q-btn(
      color="white"
      label="TELEGRAM"
      flat
      icon="img:https://img.icons8.com/dusk/32/000000/telegram-app.png"
      @click="open('telegram')")
    q-btn(
      color="white"
      label="TELOS"
      flat
      icon="img:https://img.icons8.com/dusk/32/000000/info.png"
      @click="open('more')"
    )
</template>

<style lang="stylus" scoped>

</style>
