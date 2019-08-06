<template>
<q-page>
  <div class="q-pa-md items-start q-gutter-md">
    <q-card v-for="role in roles" :key="role.id">
      <q-card-section>
        <div class="text-h6">
          {{ role.role_name }}
        </div>
        <div class="q-gutter-sm">
          <q-badge color="primary" text-color="black">
            <div class="text-subtitle2">
              {{ role.hypha_salary }} HYPHA
            </div>
          </q-badge>
          <q-badge color="primary" text-color="black">
            <div class="text-subtitle2">
              {{ role.preseeds_salary }} PRESEEDS
            </div>
          </q-badge>
          <q-badge color="primary" text-color="black">
            <div class="text-subtitle2">
              {{ role.voice_salary }} VOICE
            </div>
          </q-badge>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-body2" style="white-space: pre-wrap;">
          {{ role.description }}
        </div>
      </q-card-section>

      <q-card-section>
      <div class="text-body2">
        {{ role.info_url }}
      </div>
      </q-card-section>
    </q-card>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    roles: state => state.feeds.roles.map(role => ({
      ...role,
      descriptionFormatted: role.description.replace(/(?:\r\n|\r|\n)/g, '<br>')
    }))
  }),
  mounted () {
    this.$store.dispatch('feeds/loadRoles')
  }
}
</script>
