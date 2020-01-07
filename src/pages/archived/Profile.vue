<template>
<q-page>
  <q-form @submit="uploadAvatar">
  <q-input
    @input="val => { file = val[0] }"
    filled
    type="file"
    hint="Native file"
  />
  <q-btn label="Upload" type="submit" />
  <div>
    {{ avatarResult }}
  </div>
  </q-form>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      file: null
    }
  },
  computed: mapState({
    avatarResult: state => JSON.stringify(state.feeds.avatarResult)
  }),
  methods: {
    uploadAvatar () {
      this.$store.dispatch('feeds/uploadAvatar', { file: this.file })
    }
  }
}
</script>
