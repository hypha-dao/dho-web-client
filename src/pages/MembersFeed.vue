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

        <q-item-section avatar v-for="assignment in member.assignments" :key="assignment.id">
          <q-knob
            readonly
            v-model="assignment.data.time_share"
            show-value
            :thickness="0.37"
            color="primary"
            track-color="secondary"
            class="text-secondary q-ma-md"
          />
          <q-item-label>{{ assignment.data.role_name }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-expansion-item
        expand-separator
        icon="perm_identity"
        :label="member.description"
      >
        <q-card>
          <q-card-section>
            {{ member.fullDescription }}
          </q-card-section>
        </q-card>
      </q-expansion-item>

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
