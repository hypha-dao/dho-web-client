<template>
<q-page>
  <div class="q-pa-md q-row-6 items-start q-gutter-lg">
    <q-card v-for="member in members" :key="member.id">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="member.avatar || 'statics/avatar-placeholder.png'">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ member.fullName }}</q-item-label>
          <q-item-label caption>{{ member.accountName }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          {{ member.description }}
        </q-item-section>
      </q-item>

          <q-list bordered class="rounded-borders">
            <q-expansion-item
              v-for="assignment in member.assignments"
              :key="assignment.id"
              expand-separator
              icon="perm_identity"
              :label="assignment.role_name"
              :caption="assignment.time_share"
            >
              <q-card>
                <q-card-section>
                  {{ assignment.description }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
    </q-card>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    members: state => state.feeds.members
  }),
  mounted () {
    this.$store.dispatch('feeds/loadMembers')
  }
}
</script>
