<template>
<q-page>
  <div class="q-pa-md q-gutter-md">
    <q-card>
      <q-table
        title="Active Assignments"
        row-key="assignment_id"
        hide-bottom
        :data="activeAssignments"
        :columns="columns"
      ></q-table>
    </q-card>

    <q-card>
      <q-table
        title="Vote for new assignment"
        row-key="assignment_id"
        selection="single"
        hide-bottom
        :data="proposalAssignments"
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
          Propose yourself for assignment
        </div>
        <q-form
          class="q-pa-md"
          @submit="sendProposal"
        >
          <div class="q-col-gutter-md">
            <q-select v-model="newProposal.role_id" emit-value map-options :options="availableRoles" filled hint="choose assignment role" label="Your Role" />
            <q-input v-model="newProposal.info_url" label="Info URL" hint="CV/profile link" filled type="text" />
            <q-input v-model="newProposal.notes" label="Notes" hint="additional notes" filled type="text" />
            <q-input v-model="newProposal.start_period" hint="start period" filled type="date" />
            <q-input v-model.number="newProposal.time_share" label="Time Share" hint="percent between 0 and 100" filled type="number"
                     :rules="[val => val && val > 0 && val <= 100]"
            />
          </div>
          <q-card-actions align="right">
            <q-btn label="Create proposal" type="submit" :loading="isTransactionSending" color="primary" />
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
      newProposal: {
        role_id: '',
        info_url: '',
        notes: '',
        start_period: '',
        time_share: ''
      },
      selectedProposal: [],
      columns: [
        {
          name: 'assignment_id',
          field: 'assignment_id',
          label: 'Assignment ID'
        },
        {
          name: 'status',
          field: row => row.status === 1 ? 'OPEN' : 'CLOSED',
          label: 'Status',
          sortable: true
        },
        {
          name: 'assigned_account',
          field: 'assigned_account',
          label: 'Assigned Account'
        },
        {
          name: 'role_name',
          field: 'role_name',
          label: 'Role Name',
          align: 'left'
        },
        {
          name: 'notes',
          field: 'notes',
          label: 'Notes'
        },
        {
          name: 'info_url',
          field: 'info_url',
          label: 'Info URL'
        },
        {
          name: 'start_period',
          field: 'start_period',
          label: 'Start Period',
          format: value => new Date(value).toDateString()
        },
        {
          name: 'time_share',
          field: 'time_share',
          label: 'Time Share',
          format: value => Number.parseInt(value)
        },
        {
          name: 'created_date',
          field: 'created_date',
          label: 'Created Date'
        },
        {
          name: 'updated_date',
          field: 'updated_date',
          label: 'Updated Date'
        }
      ]
    }
  },
  computed: mapState({
    isWalletConnected: state => state.wallet.isConnected,
    isTransactionSending: state => state.wallet.isTransactionSending,
    lastTransactionHash: state => state.wallet.lastTransactionHash,
    activeAssignments: state => state.assignments.activeAssignments,
    proposalAssignments: state => state.assignments.proposalAssignments,
    availableRoles: state => state.roles.activeRoles.map(role => ({
      label: role.role_name,
      value: role.role_id
    }))
  }),
  methods: {
    sendVote (direction) {
      this.$store.dispatch('assignments/sendVote', {
        direction,
        ballot_id: this.selectedProposal[0].ballot_id
      })
    },
    sendProposal () {
      this.$store.dispatch('assignments/sendProposal', this.newProposal)
    }
  },
  mounted () {
    if (this.isWalletConnected) {
      this.$store.dispatch('assignments/loadActive')
      this.$store.dispatch('assignments/loadProposals')
      this.$store.dispatch('roles/loadActive')
    }
  },
  watch: {
    isWalletConnected () {
      this.$store.dispatch('assignments/loadActive')
      this.$store.dispatch('assignments/loadProposals')
      this.$store.dispatch('roles/loadActive')
    },
    lastTransactionHash () {
      this.$store.dispatch('assignments/loadActive')
      this.$store.dispatch('assignments/loadProposals')
    }
  }
}
</script>
