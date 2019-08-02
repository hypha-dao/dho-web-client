<template>
<q-page>
  <div class="q-pa-md q-gutter-md">
    <q-card>
      <q-table
        title="Roles"
        row-key="role_name"
        hide-bottom
        :data="roleProposals"
        :columns="columns.roles"
      ></q-table>

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
    </q-card>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    isConnected: state => state.wallet.isConnected,
    proposalRoles: state => state.roles.proposalItems,
    proposalAssignments: state => state.assignments.proposalItems,
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
  data () {
    return {
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
            name: 'status',
            field: 'status',
            label: 'Status'
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
            name: 'status',
            field: 'status',
            label: 'Status'
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
