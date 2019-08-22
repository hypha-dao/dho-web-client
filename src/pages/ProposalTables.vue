<template>
<q-page>
  <div class="q-pa-md q-gutter-md">
    <div align="center">
      <q-btn label="Vote against" color="primary" icon="thumb_down" @click="sendVote(0)" :disabled="!isAuthorized || isTransactionSending"></q-btn>
      <q-btn flat color="primary" icon="indeterminate_check_box" @click="sendVote(2)" :disabled="!isAuthorized || isTransactionSending"></q-btn>
      <q-btn label="Vote for" color="primary" icon="thumb_up" @click="sendVote(1)" :disabled="!isAuthorized || isTransactionSending"></q-btn>
    </div>

    <q-table
      title="Roles"
      row-key="proposal_id"
      grid
      hide-header
      :data="proposalRoles"
      :columns="columns.roles"
      selection="multiple"
      :selected.sync="selectedRoles"
      :pagination="pagination"
    >
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section>
              <q-checkbox dense v-model="props.selected">
                {{ props.row.role_name }}
              </q-checkbox>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-gutter-sm">
              <q-badge color="primary">
                <div class="text-subtitle2">
                  {{ props.row.hypha_salary }}
                </div>
              </q-badge>
              <q-badge color="primary">
                <div class="text-subtitle2">
                  {{ props.row.preseeds_salary }}
                </div>
              </q-badge>
              <q-badge color="primary">
                <div class="text-subtitle2">
                  {{ props.row.voice_salary }}
                </div>
              </q-badge>
            </q-card-section>
            <q-separator />
            <q-expansion-item
              expand-separator
              icon="description"
              label="Description"
            >
              <q-card>
                <q-card-section>
                  <div class="text-body2" style="white-space: pre-wrap;">
                    {{ props.row.description }}
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-separator />
            <q-expansion-item
              expand-separator
              icon="poll"
              label="Voting"
            >
              <q-list dense>
                <q-item v-for="col in props.cols.filter(col => ['yes_count', 'no_count', 'abstain_count', 'unique_voters', 'begin_time', 'end_time', 'status'].indexOf(col.name) >= 0)" :key="col.name">
                  <q-item-section>
                    <q-item-label>{{ col.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{ col.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <q-separator />
            <q-expansion-item
              expand-separator
              icon="expand_more"
              label="Details"
            >
              <q-list dense>
                <q-item v-for="col in props.cols.filter(col => ['proposal_id', 'role_name', 'proposer', 'info_url', 'created_date', 'executed_date'].indexOf(col.name) >= 0)" :key="col.name">
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
      grid
      hide-header
      selection="multiple"
      :selected.sync="selectedContributions"
      :pagination="pagination"
      title="Contributions"
      row-key="proposal_id"
      hide-bottom
      :data="proposalContributions"
      :columns="columns.contributions"
    >
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section>
              <q-checkbox dense v-model="props.selected">
                {{ props.row.notes }}
              </q-checkbox>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-gutter-sm">
              <q-badge color="primary">
                <div class="text-subtitle2">
                  {{ props.row.hypha_value }}
                </div>
              </q-badge>
              <q-badge color="primary">
                <div class="text-subtitle2">
                  {{ props.row.preseeds_value }}
                </div>
              </q-badge>
              <q-badge color="primary">
                <div class="text-subtitle2">
                  {{ props.row.voice_value }}
                </div>
              </q-badge>
            </q-card-section>
            <q-separator />
            <q-expansion-item
              expand-separator
              icon="expand_more"
              label="Details"
            >
              <q-list dense>
                <q-item v-for="col in props.cols.filter(col => col.name !== 'notes')" :key="col.proposal_id">
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
    proposalRoles: state => state.roles.proposalRoles,
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
      const roleBallots = this.selectedRoles.map(role => role.ballot_id)
      const contributionBallots = this.selectedContributions.map(contribution => contribution.ballot_id)

      const ballots = [...roleBallots, ...contributionBallots]

      this.$store.dispatch('wallet/sendVote', {
        direction,
        ballots
      })
    }
  },
  data () {
    return {
      selectedRoles: [],
      selectedContributions: [],
      pagination: {
        sortBy: 'created_date',
        descending: true,
        page: 1,
        rowsPerPage: 12
      },
      columns: {
        roles: [
          {
            name: 'proposal_id',
            field: 'proposal_id',
            label: 'Proposal ID'
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
            format: value => new Date(value).toLocaleString(),
            label: 'Created Date'
          },
          {
            name: 'executed_date',
            field: row => new Date(row.executed_date) > 0 ? row.executed_date : 'Not executed',
            label: 'Executed Date'
          },
          {
            name: 'yes_count',
            field: 'yes_count',
            label: 'YES'
          },
          {
            name: 'no_count',
            field: 'no_count',
            label: 'NO'
          },
          {
            name: 'abstain_count',
            field: 'abstain_count',
            label: 'ABSTAIN'
          },
          {
            name: 'unique_voters',
            field: 'unique_voters',
            label: 'Unique Voters'
          },
          {
            name: 'begin_time',
            field: 'begin_time',
            label: 'Begin Time',
            format: value => new Date(value * 1000).toLocaleString()
          },
          {
            name: 'end_time',
            field: 'end_time',
            label: 'End Time',
            format: value => new Date(value * 1000).toLocaleString()
          },
          {
            name: 'status',
            field: row => row.status === 0 ? 'OPEN' : 'CLOSED',
            label: 'Status'
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
            name: 'hypha_value',
            field: 'hypha_value',
            label: 'Hypha'
          },
          {
            name: 'preseeds_value',
            field: 'preseeds_value',
            label: 'Preseeds'
          },
          {
            name: 'voice_value',
            field: 'voice_value',
            label: 'Voice'
          },
          {
            name: 'created_date',
            field: 'created_date',
            label: 'Created Date',
            format: value => new Date(value).toDateString()
          },
          {
            name: 'executed_date',
            field: row => new Date(row.executed_date) > 0 ? row.executed_date : 'Not executed',
            label: 'Executed Date'
          },
          {
            name: 'contribution_date',
            field: 'contribution_date',
            label: 'Contribution Date',
            format: value => new Date(value).toDateString()
          }
        ]
      }
    }
  }
}
</script>
