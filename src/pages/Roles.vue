<template>
  <q-page padding>
    <q-card v-for="role in roles" :key="role.role_name" bordered class="q-pa-sm q-ma-sm">
      <q-card-section>
        <div class="text-h6">Role: {{ role.role_name }}</div>
      </q-card-section>

      <q-card-section>
        <div>{{ role.description }}</div>
        <div class="text-subtitle1">Salaries</div>
        <div>{{ role.hypha_salary }}</div>
        <div>{{ role.preseeds_salary }}</div>
        <div>{{ role.voice_salary }}</div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn label="apply"/>
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
