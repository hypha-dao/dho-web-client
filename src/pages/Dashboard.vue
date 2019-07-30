<template>
<q-page>
  <div class="q-pa-md q-gutter-md">
    <q-card>
      <q-card-section>
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="statics/avatar-placeholder.png">
            </q-avatar>

          </q-item-section>

          <q-item-section>
            <div class="text-h6">{{ user.name || 'No account' }}</div>
            <div class="text-subtitle2">{{ user.account || 'Please authorize to participate in governance' }}</div>
          </q-item-section>
        </q-item>

      </q-card-section>

      <q-card-section>
      <q-item>
          <q-item-section>
            <div class="text-h6">Welcome to the Hypha DAO</div>
            <div class="text-subtitle2">A Holocracy Inspired Decentralized Autonomous Organization (DAO)</div>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <q-item>
          <q-item-section>
          <q-timeline layout="dense" color="primary">
            <q-timeline-entry
              v-for="activity in activities"
              :key="activity.activity_id"
              :icon="icons[activity.verb]"
            >
              <template v-slot:title v-if="activity.verb === 'proposerole'">
                  <span v-if="activity.verb === 'proposerole'">Role "{{ activity.role_name }}"</span>
                  <span v-if="activity.verb === 'propassign'">Assignment "{{ activity.assigned_account }}"</span>
                  <span v-if="activity.verb === 'proppayout'">Contribution "{{ activity.recipient }}"</span>
              </template>

              <div class="voting">
                <p>{{ activity.reaction_counts.accepted || 0 }} members accepted this proposal</p>
                <p>{{ activity.reaction_counts.declined || 0 }} members declined this proposal</p>
              </div>

              <div class="actions">
                <q-btn v-if="!activity.reaction_counts.executed" @click="sendVote(2, activity.ballot_id)" label="Accept" icon="thumb_up" />
                <q-btn v-if="!activity.reaction_counts.executed" @click="sendVote(0, activity.ballot_id)" label="Decline" icon="thumb_down" />
                <q-btn v-if="activity.reaction_counts.executed" label="Proposal already executed" icon="done_outline" disabled />
              </div>

              <template v-slot:subtitle>
                {{ activity.time }}
              </template>
            </q-timeline-entry>
        </q-timeline>
        </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      icons: {
        proposerole: 'assignment',
        propassign: 'assignment_ind',
        proppayout: 'assignment_turned_in',
        newperiod: 'attach_money'
      }
    }
  },
  computed: mapState({
    activities: state => state.feeds.activities,
    user: state => state.feeds.user
  }),
  methods: {
    sendVote (direction, ballotId) {
      console.log('sendVote', direction, ballotId)

      this.$store.dispatch('assignments/sendVote', {
        direction,
        ballot_id: ballotId
      })
    }
  },
  mounted () {
    this.$store.dispatch('feeds/loadActivities')
  }
}
</script>
