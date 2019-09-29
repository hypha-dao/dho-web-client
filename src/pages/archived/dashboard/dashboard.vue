<template>
<q-page>
  <q-dialog class="modal" v-model="openMemberForm" persistent no-backdrop-dismiss>
    <q-card style="width:400px;">
      <q-card-section>
        <div class="text-h6">Invite code</div>
      </q-card-section>

      <q-card-section>
        <q-input
          :rules="[ validateInviteCode ]"
          ref="memberInviteCode"
          hint="You need to receive invite from other members, then tokens will be issued for you"
          filled v-model="memberForm.inviteCode" autofocus
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-item>
          <q-item-section>
            <q-btn flat label="Cancel" @click="openMemberForm = false" />
          </q-item-section>
          <q-item-section>
            <q-btn color="primary" label="Become member" @click="becomeMember(); openMemberForm = false;" />
          </q-item-section>
        </q-item>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog class="modal" v-model="openRoleForm" persistent no-backdrop-dismiss>
    <q-card style="width: 600px;">
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
            <q-input v-model="roleForm.info_url" label="URL (optional)" hint="Link to full description" filled type="text"/>
            <q-input v-model.number="roleForm.hypha_salary" label="Full time salary for every lunar cycle" hint="Hypha Salary: Monthly fairmarket USD amount for similar full-time position" filled type="number" />
            <q-input v-model.number="roleForm.preseeds_salary" label="Full time salary for every lunar cycle" hint="Preseeds Salary: Hypha Salary X (multiplier) / 0.02 (cents per Preseed)" filled type="number" />
            <q-input v-model.number="roleForm.voice_salary" label="Full time salary for every lunar cycle" hint="Hypha Voice Salary: Usually equal to Hypha Salary" filled type="number" />
            <q-input v-model="roleForm.start_period" hint="Start Date" filled type="date" />
            <q-input v-model="roleForm.end_period" hint="End Date" filled type="date" />
          </div>
          <q-card-actions align="right">
            <q-item>
              <q-item-section>
                <q-btn label="Cancel" @click="openRoleForm = false" />
              </q-item-section>
              <q-item-section>
                <q-btn label="Propose Role" type="submit" color="secondary" :loading="isTransactionSending" />
              </q-item-section>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog class="modal" v-model="openAssignmentForm" persistent no-backdrop-dismiss>
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Propose yourself for assignment
        </div>
        <q-form
          class="q-pa-md"
          @submit="proposeAssignment"
        >
          <div class="q-col-gutter-md">
            <q-select v-model="assignmentForm.role_id" emit-value map-options :options="availableRoles" filled hint="What role are you applying for?" label="Role" />
            <q-input v-model="assignmentForm.info_url" label="URL" hint="Link to your social profile or CV; LinkedIn, Github, Steemit, etc" filled type="text" />
            <q-input v-model="assignmentForm.notes" label="Notes" hint="Tell the other members more about you and what makes you qualified for this role" filled type="text" />
            <q-input v-model="assignmentForm.start_period" hint="start period" filled type="date" />
            <q-input v-model="assignmentForm.end_period" hint="end period" filled type="date" />
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
                <q-btn label="Apply for role" type="submit" :loading="isTransactionSending" color="secondary" />
              </q-item-section>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog class="modal" v-model="openContributionForm" persistent no-backdrop-dismiss>
    <q-card>
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
            <q-input v-model="contributionForm.contribution_date" hint="Contribution Date" filled type="date" />
          </div>
          <q-card-actions align="right">
            <q-item>
              <q-item-section>
                <q-btn label="Cancel" @click="openContributionForm = false" />
              </q-item-section>
              <q-item-section>
                <q-btn label="Request payout" type="submit" color="secondary" :loading="isTransactionSending" />
              </q-item-section>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog class="modal" v-model="openSalaryForm" persistent no-backdrop-dismiss>
    <q-card>
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
                <q-btn label="Claim salary" type="submit" color="secondary" :loading="isTransactionSending" />
              </q-item-section>
            </q-item>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <div class="q-pa-md q-gutter-md">
    <card-wallet-guest />
    <card-wallet-auth />

    <q-card>
      <q-card-section>
        <div class="text-h6">Apply for role</div>
        <div class="text-subtitle2">If you found a role that excites you feel free to apply for that role.</div>
        <div class="text-body2">Visit the 'Role Summary' tab to see what roles are currently available. Roles that are less than 100% filled are open.</div>
        <div class="text-body2">When applying for a role chose what percentage (100% being full time at 40 hours a week) of that role you’re applying for.</div>
      </q-card-section>
      <q-card-section align="right">
        <div class="q-gutter-md">
          <q-btn :disabled="!user.accountName" color="secondary" label="Apply for role" @click="openAssignmentForm = true" />
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Propose new role</div>
        <div class="text-subtitle2">If there isn’t a role for you and you want to contribute to Hypha, feel free to propose a new role.</div>
        <div class="text-body2">First, join the telegram group to discuss the creation of a new role to help design it. Otherwise, it may not be accepted.</div>
      </q-card-section>
      <q-card-section align="right">
        <div class="q-gutter-md">
          <q-btn :disabled="!user.accountName" color="secondary" label="Propose new role" @click="openRoleForm = true" />
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Contribute</div>
        <div class="text-subtitle2">If you have a proposal for a past or future one-time contribution.</div>
        <div class="text-body2">You can propose your contribution for voting and you will receive reward when approved.</div>
      </q-card-section>
      <q-card-section align="right">
        <div class="q-gutter-md">
          <q-btn :disabled="!user.accountName" color="secondary" label="Request contribution payment" @click="openContributionForm = true" />
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Claim Salary</div>
        <div class="text-subtitle2">Start building!</div>
        <div class="text-body2">Make sure to check back each new moon and full moon to collect your salary.</div>
      </q-card-section>
      <q-card-section align="right">
        <div class="q-gutter-md">
          <q-btn :disabled="!user.accountName" color="secondary" label="Claim salary" @click="openSalaryForm = true" />
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Engage</div>
        <div class="text-subtitle2">Participate in governance</div>
        <div class="text-body2">To ensure other members approve your proposals and contributions, attend the calls and engage with the community in the Slack and Telegram channels.</div>
        <div class="text-body2">Make sure to check back each new moon and full moon to vote on new proposals, roles, launch partners and assignments.</div>
      </q-card-section>
      <q-card-section>
        <q-timeline layout="dense" color="secondary">
          <q-timeline-entry
            v-for="activity in activities"
            :key="activity.id"
            :icon="icons[activity.verb]"
          >
            <template v-slot:title>
                <span v-if="activity.verb === 'proposerole'">Role "{{ activity.role_name }}"</span>
                <span v-if="activity.verb === 'propassign'">Assignment "{{ activity.assigned_account }}"</span>
                <span v-if="activity.verb === 'proppayout'">Contribution "{{ activity.recipient }}"</span>
            </template>

            <div class="voting" v-if="!activity.reaction_counts.executed">
              <p>{{ activity.reaction_counts.accepted || 0 }} members accepted this proposal</p>
              <p>{{ activity.reaction_counts.declined || 0 }} members declined this proposal</p>
            </div>

            <div class="actions">
              <q-btn v-if="!activity.reaction_counts.executed" @click="sendVote(activity.verb, activity.ballot_id, 2)" label="Accept" icon="thumb_up" />
              <q-btn v-if="!activity.reaction_counts.executed" @click="sendVote(activity.verb, activity.ballot_id, 0)" label="Decline" icon="thumb_down" />
              <q-btn v-if="activity.reaction_counts.executed" label="Proposal accepted" icon="done_outline" disabled />
            </div>

            <template v-slot:subtitle>
              {{ activity.time }}
            </template>
          </q-timeline-entry>
      </q-timeline>
      </q-card-section>
    </q-card>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'
import CardWalletAuth from './components/card-wallet-auth/index'
import CardWalletGuest from './components/card-wallet-guest/index.vue'

export default {
  components: {
    CardWalletGuest,
    CardWalletAuth
  },
  data () {
    return {
      openSalaryForm: false,
      openRoleForm: false,
      openAssignmentForm: false,
      openContributionForm: false,
      openMemberForm: false,
      openUpdateForm: false,
      updateForm: {
        fullName: '',
        description: '',
        avatar: ''
      },
      memberForm: {
        inviteCode: '',
        validInviteCode: false
      },
      roleForm: {
        role_name: '',
        info_url: '',
        description: '',
        hypha_salary: '',
        preseeds_salary: '',
        voice_salary: '',
        start_period: '',
        end_period: ''
      },
      assignmentForm: {
        role_id: '',
        info_url: '',
        notes: '',
        start_period: '',
        end_period: '',
        time_share: ''
      },
      contributionForm: {
        notes: '',
        info_url: '',
        hypha_value: '',
        preseeds_value: '',
        voice_value: '',
        contribution_date: ''
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
  computed: {
    memberInviteCode () { return this.memberForm.inviteCode },
    ...mapState({
      activities: state => state.feeds.activities,
      user: state => state.feeds.user,
      isWalletConnected: state => state.wallet.isConnected,
      isTransactionSending: state => state.wallet.isTransactionSending,
      availableRoles: state => state.roles.activeRoles.map(role => ({
        label: role.role_name,
        value: role.role_id
      }))
    })
  },
  methods: {
    async validateInviteCode (inviteCode) {
      return this.registerForm.validInviteCode || this.memberForm.validInviteCode
    },
    closeWallet () {
      this.$store.dispatch('wallet/closeWallet')
    },
    becomeMember () {
      const { inviteCode } = this.memberForm

      this.$store.dispatch('wallet/becomeMember', { inviteCode })

      this.openMemberForm = false
    },
    updateProfile () {
      const { fullName, description, fullDescription } = this.updateForm

      this.$store.dispatch('feeds/updateProfile', { fullName, description, fullDescription })

      this.openUpdateForm = false
    },
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

    if (this.user && this.user.data) {
      this.updateForm = {
        ...this.updateForm,
        ...this.user.data
      }
    }
  },
  watch: {
    user (data) {
      this.updateForm = {
        ...this.updateForm,
        ...data
      }
    },
    openAssignmentForm (isOpened) {
      console.log({ isOpened })

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
    },
    async registerAccountName (val) {
      await this.$refs.registerAccountName.validate()

      if (!this.$refs.registerAccountName.hasError) {
        this.registerForm.validAccountName = true
      }
    },
    async registerInviteCode (inviteCode) {
      try {
        const response = await fetch(`https://diadem.host/hypha/checkInviteCode`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inviteCode })
        })

        const { isValid } = await response.json()

        if (isValid) {
          this.registerForm.validInviteCode = true
        }
      } catch (err) {
        console.log('catch validate', err)
        return 'Service not available'
      }
    },
    async memberInviteCode (inviteCode) {
      try {
        const response = await fetch(`https://diadem.host/hypha/checkInviteCode`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inviteCode })
        })

        const { isValid } = await response.json()

        if (isValid) {
          this.memberForm.validInviteCode = true
        }
      } catch (err) {
        console.log('catch validate', err)
        return 'Service not available'
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
