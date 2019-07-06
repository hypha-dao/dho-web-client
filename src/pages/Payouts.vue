<template>
<q-page>
  <div class="q-pa-md q-gutter-md">
    <q-card>
      <q-table
        title="Executed Payouts"
        row-key="proposal_id"
        hide-bottom
        :data="activeItems"
        :columns="columns"
      ></q-table>
    </q-card>

    <q-card>
      <q-table
        title="Vote for execution"
        row-key="proposal_id"
        selection="single"
        hide-bottom
        :data="proposalItems"
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
          Request payout for yourself
        </div>
        <q-form
          class="q-pa-md"
          @submit="sendProposal"
        >
          <div class="q-col-gutter-md">
            <q-input v-model="newProposal.notes" label="Notes" hint="payout purpose" filled type="text" />
            <q-input v-model="newProposal.info_url" label="Info URL" hint="link to invoice" filled type="text" />
            <q-input v-model.number="newProposal.hypha_salary" label="Hypha Value" hint="amount once" filled type="number" />
            <q-input v-model.number="newProposal.preseeds_salary" label="Preseeds Value" hint="amount once" filled type="number" />
            <q-input v-model.number="newProposal.voice_salary" label="Voice Value" hint="amount once" filled type="number" />
          </div>
          <q-card-actions align="right">
            <q-btn label="Request payout" type="submit" color="primary" />
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
        notes: '',
        info_url: '',
        hypha_value: '',
        preseeds_value: '',
        voice_value: ''
      },
      selectedProposal: [],
      columns: [
        {
          name: 'proposal_id',
          field: 'proposal_id',
          label: 'Proposal ID'
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
  },
  computed: mapState({
    isWalletConnected: state => state.wallet.isConnected,
    isTransactionSending: state => state.wallet.isTransactionSending,
    activeItems: state => state.payouts.activeItems,
    proposalItems: state => state.payouts.proposalItems
  }),
  methods: {
    sendVote (direction) {
      this.$store.dispatch('payouts/sendVote', {
        direction,
        ballot_id: this.selectedProposal[0].ballot_id
      })
    },
    sendProposal () {
      this.$store.dispatch('payouts/sendProposal', this.newProposal)
    }
  },
  mounted () {
    if (this.isWalletConnected) {
      this.$store.dispatch('payouts/loadActive')
      this.$store.dispatch('payouts/loadProposals')
    }
  },
  watch: {
    isWalletConnected () {
      this.$store.dispatch('payouts/loadActive')
      this.$store.dispatch('payouts/loadProposals')
    }
  }
}
</script>
