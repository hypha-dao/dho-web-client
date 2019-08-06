<template>
<q-page>
  <q-dialog class="modal" v-model="openLoginForm" persistent no-backdrop-dismiss>
    <q-card style="width:400px;">
      <q-card-section>
        <div class="text-h6">Account Name</div>
      </q-card-section>

      <q-card-section>
        <q-input
          ref="loginAccountName"
          maxlength="12"
          :rules="[
            val => !/[^a-z1-5]/.test(val) || '12 symbols (a-z and only 1-5)',
            val => val.length === 12 || '12 symbols (a-z and only 1-5)'
          ]"
          hint="12 symbols [a-z12345.]"
          dense v-model="loginForm.accountName" autofocus
        />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Private Key</div>
      </q-card-section>

      <q-card-section>
        <q-input
          ref="loginPrivateKey"
          dense v-model="loginForm.privateKey" autofocus
          :rules="[ val => val.length > 0 ]"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-item>
          <q-item-section>
            <q-btn flat label="Cancel" @click="openLoginForm = false" />
          </q-item-section>
          <q-item-section>
            <q-btn flat :disabled="!loginForm.validAccountName" label="Login" @click="login(); openLoginForm = false;" />
          </q-item-section>
        </q-item>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog class="modal" v-model="openRegisterForm" persistent no-backdrop-dismiss>
    <q-card style="width: 700px;">
    <q-stepper v-model="registerForm.step" horizontal color="primary" animated :contracted="$q.screen.lt.md">
      <q-step name="chooseAccountName" title="1. Choose account name">
        <q-input
          ref="registerAccountName"
          maxlength="12"
          :rules="[
            val => !/[^a-z1-5]/.test(val) || '12 symbols (a-z and only 1-5)',
            val => val.length === 12 || '12 symbols (a-z and only 1-5)'
          ]"
          v-model="registerForm.accountName" type="text" label="Account name" hint="12 symbols [a-z12345.]">
          </q-input>

        <q-stepper-navigation>
          <q-item>
            <q-item-section>
              <q-btn flat label="Cancel" @click="openRegisterForm = false" />
            </q-item-section>
            <q-item-section>
              <q-btn :disabled="!registerForm.validAccountName" @click="registerForm.step = 'generateKeys'; generateKeys();" color="primary" label="Continue" />
            </q-item-section>
          </q-item>
        </q-stepper-navigation>
      </q-step>

      <q-step name="generateKeys" title="2. Generate keys" id="privateKey">
        <div class="text-h6">
          Save your keys before you can create account
        </div>

        <q-input v-model="registerForm.privateKey" color="primary" readonly hint="Private Key (click to copy/paste before you can continue)">
          <template v-slot:before>
            <q-btn round color="primary" icon="file_copy" v-clipboard:copy="registerForm.privateKey" @click="registerForm.privateKeySaved = true" />
          </template>
        </q-input>
        <q-input v-model="registerForm.publicKey" color="primary" readonly hint="Public Key (click to copy/paste before you can continue)">
          <template v-slot:before>
            <q-btn round color="primary" icon="file_copy" v-clipboard:copy="registerForm.publicKey" @click="registerForm.publicKeySaved = true" />
          </template>
        </q-input>

        <q-stepper-navigation>
          <q-item>
            <q-item-section>
              <q-btn @click="openRegisterForm = false" label="Cancel" color="secondary" />
            </q-item-section>
            <q-item-section>
              <q-btn color="secondary" :disabled="!registerForm.privateKeySaved || !registerForm.publicKeySaved" @click="register(); registerForm.step = 'createAccount'" label="Continue" />
            </q-item-section>
          </q-item>
        </q-stepper-navigation>
      </q-step>

      <q-step name="createAccount" title="3. Create account">
        <div class="text-subtitle2">
          Congratulations! Welcome to Hypha DAO, {{ registerForm.accountName }}!
        </div>

        <q-stepper-navigation>
          <q-item>
            <q-item-section>
              <q-btn @click="openRegisterForm = false" label="Done" color="secondary" />
            </q-item-section>
          </q-item>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
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
            <q-input v-model="roleForm.info_url" label="URL (optional)" hint="Link to full description on IPFS" filled type="text"/>
            <q-input v-model.number="roleForm.hypha_salary" label="The *full-time* salary for every 14 days (half lunar cycle)" hint="Hypha Salary: Fairmarket USD amount for a similar full-time position divide by 26 (half lunar cycles i)" filled type="number" />
            <q-input v-model.number="roleForm.preseeds_salary" label="The *full-time* salary for every 14 days (half lunar cycle)" hint="Preseeds Salary: Hypha Salary X (multiplier) X 0.02 (cents per Preseed)" filled type="number" />
            <q-input v-model.number="roleForm.voice_salary" label="The *full-time* salary for every 14 days (half lunar cycle)" hint="Hypha Voice Salary: Usually equal to Hypha Salary" filled type="number" />
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
    <q-card v-if="!isWalletConnected || !user.accountName">
      <q-card-section class="q-gutter-y-sm">
        <div class="text-h6">Welcome to the Hypha DAO</div>
        <div class="text-subtitle2">The DAO is the way to enlightenment (the TAO). It is also a Decentralized Autonomous Organization</div>
        <div class="text-body2">Hypha is the global, open organization that's launching SEEDS and other decentralized applications. Our mission is to create digial tools for our Regenerative Society</div>
        <div class="text-body2">SEEDS wouldn't be decentralized if the team behind it was centralized. For this reason and many more we've opened up the organization for all to participate and direct</div>
        <div class="text-body2">Hypha DAO is an experiment in the future of organizations. Not only are you participating in co-creating SEEDS but you're also participating in co-creating Hypha. You can have a direct impact in how this organization evolves</div>
        <div class="text-subtitle2">If you have a Telos mainnet account - just login. Or, create an account. *Ensure you safely store your private key!*</div>
      </q-card-section>
      <q-card-section align="right" class="q-gutter-sm">
        <q-btn color="secondary" label="Create account" @click="openRegisterForm = true" />
        <q-btn color="secondary" label="Connect account" @click="openLoginForm = true" />
      </q-card-section>
    </q-card>

    <q-card v-if="isWalletConnected && user.accountName">
      <q-card-section>
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img :src="user.avatar || 'statics/avatar-placeholder.png'">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="text-h6">{{ user.fullName ? user.fullName : user.accountName }}</div>
            <div class="text-subtitle2">{{ user.fullName ? user.accountName : '' }}</div>
          </q-item-section>

          <q-item-section>
            <q-btn color="secondary" label="Disconnect account" @click="logout()" />
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-section>
        <q-item>
          <q-item-section>
            {{ user.description }}
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>

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
import wallet from '../wallet'

export default {
  data () {
    return {
      openSalaryForm: false,
      openRoleForm: false,
      openAssignmentForm: false,
      openContributionForm: false,
      openRegisterForm: false,
      openLoginForm: false,
      loginForm: {
        privateKey: '',
        accountName: '',
        validAccountName: false
      },
      registerForm: {
        step: 'chooseAccountName',
        privateKey: '',
        publicKey: '',
        accountName: '',
        validAccountName: false,
        privateKeySaved: false,
        publicKeySaved: false
      },
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
  computed: {
    registerAccountName () { return this.registerForm.accountName },
    loginAccountName () { return this.loginForm.accountName },
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
    async generateKeys () {
      const { privateKey, publicKey } = await wallet.generateKeys()

      this.registerForm = {
        ...this.registerForm,
        privateKey,
        publicKey
      }
    },
    async login () {
      const { accountName, privateKey } = this.loginForm

      this.$store.dispatch('wallet/login', { accountName, privateKey })
    },
    async logout () {
      this.$store.dispatch('wallet/logout')
    },
    async register () {
      const { accountName, privateKey, publicKey } = this.registerForm

      this.$store.dispatch('wallet/register', { accountName, privateKey, publicKey })
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
    },
    async registerAccountName (val) {
      await this.$refs.registerAccountName.validate()

      if (!this.$refs.registerAccountName.hasError) {
        this.registerForm.validAccountName = true
      }
    },
    async loginAccountName (val) {
      await this.$refs.loginAccountName.validate()

      if (!this.$refs.loginAccountName.hasError) {
        this.loginForm.validAccountName = true
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
