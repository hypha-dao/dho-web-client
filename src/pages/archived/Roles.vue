<script src="../store/modules/payouts.js"></script>
<template>
<q-page>
  <div class="q-pa-md q-gutter-md">
    <q-card>
      <q-table
        title="Active Roles"
        row-key="role_name"
        hide-bottom
        :data="activeRoles"
        :columns="columns"
      ></q-table>
    </q-card>

    <q-card>
      <q-table
        title="Vote for new role"
        row-key="role_name"
        selection="single"
        hide-bottom
        :data="proposalRoles"
        :columns="columns"
        :selected.sync="selectedProposal"
      ></q-table>

      <q-card-actions align="right">
        <q-btn round color="primary" icon="thumb_down" @click="sendVote(0)" :disabled="isTransactionSending"></q-btn>
        <q-btn round color="primary" icon="indeterminate_check_box" @click="sendVote(1)" :disabled="isTransactionSending"></q-btn>
        <q-btn round color="primary" icon="thumb_up" @click="sendVote(2)" :disabled="isTransactionSending"></q-btn>
      </q-card-actions>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">
          Propose new role
        </div>
        <q-form
          class="q-pa-md"
          @submit="sendProposal"
        >
          <div class="q-col-gutter-md">
            <q-input v-model="newProposal.role_name" type="text" hint="less than 32 symbols" label="Role name" filled
                     :rules="[val => val && val.length > 0 && val.length <= 32 || 'Role name is not valid']"
            />
            <q-input v-model="newProposal.description" label="Description *" hint="The purpose, accountabilities and domain for this role" filled type="textarea"
                     :rules="[val => val && val.length > 0 || 'Description is not valid']"
            />
            <q-input v-model="newProposal.info_url" label="URL (optional)" hint="Link to full description on IPFS" filled type="text"/>
            <q-input v-model.number="newProposal.hypha_salary" label="Hypha Salary: Fairmarket USD amount for a similar full-time position divide by 26 (half lunar cycles i)" hint="The *full-time* salary for every 14 days (half lunar cycle)" filled type="number" />
            <q-input v-model.number="newProposal.preseeds_salary" label="Preseeds Salary: Hypha Salary X (multiplier) X 0.02 (cents per Preseed)" hint="The *full-time* salary for every 14 days (half lunar cycle)" filled type="number" />
            <q-input v-model.number="newProposal.voice_salary" label="Hypha Voice Salary: Usually equal to Hypha Salary" hint="The *full-time* salary for every 14 days (half lunar cycle)" filled type="number" />
          </div>
          <q-card-actions align="right">
            <q-btn label="Propose Role" type="submit" color="primary" :loading="isTransactionSending" />
          </q-card-actions>
        </q-form>
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
      selectedProposal: [],
      newProposal: {
        role_name: '',
        info_url: '',
        description: '',
        hypha_salary: '',
        preseeds_salary: '',
        voice_salary: '',
        contribution_date: ''
      },
      columns: [
        {
          name: 'role_name',
          field: 'role_name',
          label: 'Role Name',
          align: 'left'
        },
        {
          name: 'status',
          field: row => row.status === 1 ? 'OPEN' : 'CLOSED',
          label: 'Status',
          sortable: true
        },
        {
          name: 'description',
          field: 'description',
          label: 'Description'
        },
        {
          name: 'salary',
          field: row => `${row.hypha_salary} + ${row.preseeds_salary} + ${row.voice_salary}`,
          label: 'Salary per month'
        },
        {
          name: 'created_date',
          field: 'created_date',
          label: 'Created'
        },
        {
          name: 'updated_date',
          field: 'updated_date',
          label: 'Updated'
        }
      ]
    }
  },
  computed: mapState({
    isWalletConnected: state => state.wallet.isConnected,
    isTransactionSending: state => state.wallet.isTransactionSending,
    lastTransactionHash: state => state.wallet.lastTransactionHash,
    activeRoles: state => state.roles.activeRoles,
    proposalRoles: state => state.roles.proposalRoles
  }),
  methods: {
    sendVote (direction) {
      this.$store.dispatch('roles/sendVote', {
        direction,
        ballot_id: this.selectedProposal[0].ballot_id
      })
    },
    sendProposal () {
      this.$store.dispatch('roles/sendProposal', this.newProposal)
    }
  },
  mounted () {
    if (this.isWalletConnected) {
      this.$store.dispatch('roles/loadActive')
      this.$store.dispatch('roles/loadProposals')
    }
  },
  watch: {
    isWalletConnected () {
      this.$store.dispatch('roles/loadActive')
      this.$store.dispatch('roles/loadProposals')
    },
    lastTransactionHash () {
      this.$store.dispatch('roles/loadActive')
      this.$store.dispatch('roles/loadProposals')
    }
  }
}
</script>
