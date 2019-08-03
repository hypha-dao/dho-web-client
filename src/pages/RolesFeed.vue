<template>
<q-page>
  <div class="q-pa-md items-start q-gutter-md">
    <q-card v-for="role in roles" :key="role.id">
      <q-card-section>
        {{ role.role_name }}
      </q-card-section>

      <q-card-section>
        {{ role.description }}
      </q-card-section>

      <q-card-section>
        {{ role.info_url }}
      </q-card-section>

      <q-card-section>
        {{ role.hypha_salary }} HYPHA
        {{ role.preseeds_salary }} PRESEEDS
        {{ role.voice_salary }} VOICE
      </q-card-section>
    </q-card>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    roles: state => state.feeds.roles
  }),
  mounted () {
    this.$store.dispatch('feeds/loadRoles')
  }
}
</script>
