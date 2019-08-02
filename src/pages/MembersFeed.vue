<template>
<q-page>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card v-for="user in users" :key="user.id" style="max-width:250px;">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="user.avatar || 'statics/avatar-placeholder.png'">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.fullName }}</q-item-label>
          <q-item-label caption>{{ user.accountName }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
      <q-item-section>
        {{ user.description }}
      </q-item-section>
      </q-item>
    </q-card>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      users: state => state.feeds.users
    })
  },
  mounted () {
    this.$store.dispatch('feeds/loadUsers')
  }
}
</script>
