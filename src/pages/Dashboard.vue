<template>
<q-page>
  <q-dialog class="modal" v-model="openRoleForm" persistent no-backdrop-dismiss>
    <q-card style="min-width: 600px;">
      <q-card-section>
        <div class="text-h6">
          Propose new role
        </div>
        <q-form
          class="q-pa-md"
          @submit="proposeRole"
        >
          <div class="q-col-gutter-md">
            <q-input v-model="roleForm.role_name" type="text" hint="less than 32 symbols" label="Role name" filled
                     :rules="[val => val && val.length > 0 && val.length <= 32 || 'Role name is not valid']"
            />
            <q-input v-model="roleForm.description" label="Description *" hint="The purpose, accountabilities and domain for this role" filled type="textarea"
                     :rules="[val => val && val.length > 0 || 'Description is not valid']"
            />
            <q-input v-model="roleForm.info_url" label="URL (optional)" hint="Link to full description on IPFS" filled type="text"/>
            <q-input v-model.number="roleForm.hypha_salary" label="Hypha Salary: Fairmarket USD amount for a similar full-time position divide by 26 (half lunar cycles i)" hint="The *full-time* salary for every 14 days (half lunar cycle)" filled type="number" />
            <q-input v-model.number="roleForm.preseeds_salary" label="Preseeds Salary: Hypha Salary X (multiplier) X 0.02 (cents per Preseed)" hint="The *full-time* salary for every 14 days (half lunar cycle)" filled type="number" />
            <q-input v-model.number="roleForm.voice_salary" label="Hypha Voice Salary: Usually equal to Hypha Salary" hint="The *full-time* salary for every 14 days (half lunar cycle)" filled type="number" />
          </div>
          <q-card-actions align="right">
            <q-item>
              <q-item-section>
                <q-btn label="Cancel" @click="openRoleForm = false" />
              </q-item-section>
              <q-item-section>
                <q-btn label="Propose Role" type="submit" color="primary" :loading="isTransactionSending" />
              </q-item-section>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog class="modal" v-model="openAssignmentForm" persistent no-backdrop-dismiss>
    <q-card style="min-width: 600px;">
      <q-card-section>
        <div class="text-h6">
          Propose yourself for assignment
        </div>
        <q-form
          class="q-pa-md"
          @submit="proposeAssignment"
        >
          <div class="q-col-gutter-md">
            <q-select v-model="assignmentForm.role_id" emit-value map-options :options="assignmentForm.availableRoles" filled hint="What role are you applying for?" label="Role" />
            <q-input v-model="assignmentForm.info_url" label="URL" hint="Link to your social profile or CV; LinkedIn, Github, Steemit, etc" filled type="text" />
            <q-input v-model="assignmentForm.notes" label="Notes" hint="Tell the other members more about you and what makes you qualified for this role" filled type="text" />
            <q-input v-model="assignmentForm.start_period" hint="start period" filled type="date" />
            <q-input v-model.number="assignmentForm.time_share" label="Time Share" hint="percent between 0 and 100" filled type="number"
                     :rules="[val => val && val > 0 && val <= 100]"
            />
          </div>
          <q-card-actions align="right">
            <q-item>
              <q-item-section>
                <q-btn label="Cancel" @click="openAssignmentForm = false" />
              </q-item-section>
              <q-item-section>
                <q-btn label="Apply for role" type="submit" :loading="isTransactionSending" color="primary" />
              </q-item-section>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog class="modal" v-model="openContributionForm" persistent no-backdrop-dismiss>
    <q-card style="min-width: 600px;">
      <q-card-section>
        <div class="text-h6">
          What are you requesting compensation for?
        </div>
        <q-form
          class="q-pa-md"
          @submit="proposeContribution"
        >
          <div class="q-col-gutter-md">
            <q-input v-model="contributionForm.notes" label="Notes" hint="Tell the Hypha members more about it. What did you do and why are your requesting the amount you are" filled type="text" />
            <q-input v-model="contributionForm.info_url" label="Info URL" hint="link to invoice" filled type="text" />
            <q-input v-model.number="contributionForm.hypha_salary" label="Hypha Equity" hint="One time payment" filled type="number" />
            <q-input v-model.number="contributionForm.preseeds_salary" label="Preseeds Tokens" hint="One time payment" filled type="number" />
            <q-input v-model.number="contributionForm.voice_salary" label="Hypha Voice" hint="One time payment" filled type="number" />
          </div>
          <q-card-actions align="right">
            <q-item>
              <q-item-section>
                <q-btn label="Cancel" @click="openContributionForm = false" />
              </q-item-section>
              <q-item-section>
                <q-btn label="Request payout" type="submit" color="primary" :loading="isTransactionSending" />
              </q-item-section>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog class="modal" v-model="openSalaryForm" persistent no-backdrop-dismiss>
    <q-card style="min-width: 600px;">
      <q-card-section>
        <div class="text-h6">
          Request payment for your assignment
        </div>
        <q-form
          class="q-pa-md"
          @submit="withdrawPayment"
        >
          <div class="q-col-gutter-md">
            <q-input v-model="salaryForm.assignment_id" label="Assignment ID" hint="Choose assignment" />
            <q-input v-model="salaryForm.period_id" label="Period ID" hint="Choose payment period" />
          </div>
          <q-card-actions align="right">
            <q-item>
              <q-item-section>
                <q-btn label="Cancel" @click="openSalaryForm = false" />
              </q-item-section>
              <q-item-section>
                <q-btn label="Withdraw payment" type="submit" color="primary" :loading="isTransactionSending" />
              </q-item-section>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

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
          <q-item-section v-if="user.description">
            {{ user.description }}
          </q-item-section>
          <q-item-section v-if="!user.description">
            <div class="text-h6">Welcome to the Hypha DAO</div>
            <div class="text-subtitle2">A Holocracy Inspired Decentralized Autonomous Organization (DAO)</div>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <q-btn-group push>
          <q-btn push color="primary" label="Propose Role" @click="openRoleForm = true" />
          <q-btn push color="primary" label="Apply for role" @click="openAssignmentForm = true" />
          <q-btn push color="primary" label="Request contribution payment" @click="openContributionForm = true" />
          <q-btn push color="primary" label="Withdraw period payment" @click="openSalaryForm = true" />
        </q-btn-group>
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
                <q-btn v-if="!activity.reaction_counts.executed" @click="sendVote(activity.verb, activity.ballot_id, 2)" label="Accept" icon="thumb_up" />
                <q-btn v-if="!activity.reaction_counts.executed" @click="sendVote(activity.verb, activity.ballot_id, 0)" label="Decline" icon="thumb_down" />
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
      openSalaryForm: false,
      openRoleForm: false,
      openAssignmentForm: false,
      openContributionForm: false,
      roleForm: {
        role_name: '',
        info_url: '',
        description: '',
        hypha_salary: '',
        preseeds_salary: '',
        voice_salary: '',
        contribution_date: ''
      },
      assignmentForm: {
        role_id: '',
        info_url: '',
        notes: '',
        start_period: '',
        time_share: ''
      },
      contributionForm: {
        notes: '',
        info_url: '',
        hypha_value: '',
        preseeds_value: '',
        voice_value: ''
      },
      salaryForm: {
        assignment_id: '',
        proposal_id: ''
      },
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
    user: state => state.feeds.user,
    isWalletConnected: state => state.wallet.isConnected,
    isTransactionSending: state => state.wallet.isTransactionSending,
    availableRoles: state => state.roles.activeRoles.map(role => ({
      label: role.role_name,
      value: role.role_id
    }))
  }),
  methods: {
    sendVote (verb, ballotId, direction) {
      console.log('sendVote', direction, ballotId)

      let action = null
      switch (verb) {
        case 'propassign':
          action = 'assignments/sendVote'
          break
        case 'proposerole':
          action = 'roles/sendVote'
          break
        case 'proppayout':
          action = 'payouts/sendVote'
          break
      }

      this.$store.dispatch(action, {
        direction,
        ballot_id: ballotId
      })
    },
    proposeRole () {
      this.$store.dispatch('roles/sendProposal', this.roleForm)
    },
    proposeAssignment () {
      this.$store.dispatch('assignments/sendProposal', this.assignmentForm)
    },
    proposeContribution () {
      this.$store.dispatch('payouts/sendProposal', this.contributionForm)
    },
    withdrawPayment () {
      this.openModal.salaryForm = false
    }
  },
  mounted () {
    this.$store.dispatch('feeds/loadActivities')
  },
  watch: {
    openAssignmentForm (isOpened) {
      if (isOpened === true) {
        this.$store.dispatch('roles/loadActive')
      }
    },
    isTransactionSending (sending) {
      if (sending === false) {
        this.openRoleForm = false
        this.openAssignmentForm = false
        this.openContributionForm = false
        this.openSalaryForm = false
      }
    }
  }
}
</script>

<style>
  .modal {
    align-items: center;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 6000;
    border-radius: 0 !important;
    max-width: 100vw;
    max-height: 100vh;
  }
</style>
