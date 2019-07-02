<template>
  <q-page padding>
    Roles
    <q-card v-for="role in roles" :key="role.role_name" class="q-pa-sm q-ma-sm">
      <q-card-section>
        <div  class="text-subtitle2">Role: {{ role.role_name }}</div>
      </q-card-section>

      <q-card-section>
        {{ role.description }}
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn icon="thumb_up"/>
        <q-btn icon="thumb_down"/>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Roles',
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      wallet: 'getWallet',
      roles: 'getRoles'
    })
  }
}
</script>

<style>
</style>
