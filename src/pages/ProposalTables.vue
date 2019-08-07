<template>
<q-page>
  <div class="q-pa-md q-gutter-md">
    <q-table
      title="Roles"
      row-key="role_name"
      grid
      hide-header
      :data="proposalRoles"
      :columns="columns.roles"
      selection="single"
      :selected.sync="selectedProposal"
    >
      <template v-slot:top-right>
        <q-btn label="Decline" color="primary" icon="thumb_down" @click="sendVote(0)" :disabled="!isAuthorized || isTransactionSending"></q-btn>
        <q-btn flat color="primary" icon="indeterminate_check_box" @click="sendVote(1)" :disabled="!isAuthorized || isTransactionSending"></q-btn>
        <q-btn label="Accept" color="primary" icon="thumb_up" @click="sendVote(2)" :disabled="!isAuthorized || isTransactionSending"></q-btn>
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section>
              <q-checkbox dense v-model="props.selected">
                Role `{{ props.row.role_name }}`
              </q-checkbox>
            </q-card-section>
            <q-separator />
            <q-expansion-item
              expand-separator
              icon="description"
              label="Description"
            >
              <q-card>
                <q-card-section>
                  {{ props.row.description }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-separator />
            <q-expansion-item
              expand-separator
              icon="expand_more"
              label="Details"
            >
              <q-list dense>
                <q-item v-for="col in props.cols.filter(col => col.name !== 'description')" :key="col.name">
                  <q-item-section>
                    <q-item-label>{{ col.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{ col.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-table
      title="Assignments"
      row-key="assignment_id"
      hide-bottom
      :data="proposalAssignments"
      :columns="columns.assignments"
    ></q-table>

    <q-table
      title="Contributions"
      row-key="proposal_id"
      hide-bottom
      :data="proposalContributions"
      :columns="columns.contributions"
    ></q-table>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    isTransactionSending: state => state.wallet.isTransactionSending,
    isConnected: state => state.wallet.isConnected,
    isAuthorized: state => !!state.wallet.accountName,
    proposalRoles: state => state.roles.proposalRoles.reverse(),
    proposalAssignments: state => state.assignments.proposalAssignments,
    proposalContributions: state => state.payouts.proposalItems
  }),
  mounted () {
    if (this.isConnected) {
      this.$store.dispatch('roles/loadProposals')
      this.$store.dispatch('assignments/loadProposals')
      this.$store.dispatch('payouts/loadProposals')
    }
  },
  watch: {
    isConnected (val) {
      if (val) {
        this.$store.dispatch('roles/loadProposals')
        this.$store.dispatch('assignments/loadProposals')
        this.$store.dispatch('payouts/loadProposals')
      }
    }
  },
  methods: {
    sendVote (direction) {
      this.$store.dispatch('roles/sendVote', {
        direction,
        ballot_id: this.selectedProposal[0].ballot_id
      })
    }
  },
  data () {
    return {
      selectedProposal: [],
      columns: {
        roles: [
          {
            name: 'proposal_id',
            field: 'proposal_id',
            label: 'Proposal ID'
          },
          {
            name: 'status',
            field: row => row.status === 1 ? 'OPEN' : 'CLOSED',
            label: 'Status',
            sortable: true
          },
          {
            name: 'role_name',
            field: 'role_name',
            label: 'Role Name'
          },
          {
            name: 'proposer',
            field: 'proposer',
            label: 'Proposer'
          },
          {
            name: 'description',
            field: 'description',
            label: 'Description'
          },
          {
            name: 'info_url',
            field: 'info_url',
            label: 'URL'
          },
          {
            name: 'hypha_salary',
            field: 'hypha_salary',
            label: 'Hypha Salary'
          },
          {
            name: 'preseeds_salary',
            field: 'preseeds_salary',
            label: 'Preseeds Salary'
          },
          {
            name: 'voice_salary',
            field: 'voice_salary',
            label: 'Voice Salary'
          },
          {
            name: 'created_date',
            field: 'created_date',
            label: 'Created Date'
          },
          {
            name: 'executed_date',
            field: 'executed_date',
            label: 'Executed Date'
          }
        ],
        assignments: [
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
        ],
        contributions: [
          {
            name: 'proposal_id',
            field: 'proposal_id',
            label: 'Proposal ID'
          },
          {
            name: 'status',
            field: row => row.status === 1 ? 'OPEN' : 'CLOSED',
            label: 'Status',
            sortable: true
          },
          {
            name: 'recipient',
            field: 'recipient',
            label: 'Recipient'
          },
          {
            name: 'notes',
            field: 'notes',
            label: 'Notes'
          },
          {
            name: 'info_url',
            field: 'info_url',
            label: 'URL'
          },
          {
            name: 'payout_value',
            field: row => `${row.hypha_value} + ${row.preseeds_value} + ${row.voice_value}`,
            label: 'Payout Value'
          },
          {
            name: 'created_date',
            field: 'created_date',
            label: 'Created Date'
          },
          {
            name: 'executed_date',
            field: 'executed_date',
            label: 'Executed Date'
          },
          {
            name: 'contribution_date',
            field: 'contribution_date',
            label: 'Contribution Date'
          }
        ]
      }
    }
  }
}
</script>
