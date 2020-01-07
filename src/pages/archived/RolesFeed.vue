<template>
<q-page>
  <div class="q-pa-md items-start q-gutter-md">
    <q-card v-for="role in roles" :key="role.id">
      <q-card-section>
        <q-item>
          <q-item-section>
            <div class="text-h6">
              {{ role.role_name }}
            </div>
            <div class="q-gutter-sm">
              <q-badge color="primary">
                <div class="text-h6">
                  {{ role.hypha_salary }} HYPHA
                </div>
              </q-badge>
              <q-badge color="primary">
                <div class="text-h6">
                  {{ role.preseeds_salary }} PRESEEDS
                </div>
              </q-badge>
              <q-badge color="primary">
                <div class="text-h6">
                  {{ role.voice_salary }} VOICE
                </div>
              </q-badge>
            </div>
          </q-item-section>
          <q-item-section avatar v-for="assignment in role.assignments" :key="assignment.id">
            <q-knob
              readonly
              v-model="assignment.data.time_share"
              show-value
              :thickness="0.37"
              color="primary"
              track-color="secondary"
              class="text-secondary q-ma-md"
            />
            <q-item-label>{{ assignment.data.assigned_account }}</q-item-label>
          </q-item-section>
        </q-item>
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

      <q-card-section align="right">
        <div class="q-gutter-md">
          <q-btn color="secondary" label="Apply for role" to="/dashboard" />
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
    roles: state => state.feeds.roles
  }),
  mounted () {
    this.$store.dispatch('feeds/loadRoles')
  }
}
</script>
