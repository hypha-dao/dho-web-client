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
        style="width: 100%;"
        hide-bottom
        :data="proposalRoles"
        :columns="columns"
        :selected.sync="selectedProposal"
      ></q-table>

      <q-card-actions align="right">
        <q-btn label="Send vote" @click="sendVote" color="primary"></q-btn>
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
            <q-input v-model="newProposal.role_name" type="text" hint="less than 13 symbols, lowercase" label="Role name" filled
                     :rules="[val => val && val.length > 0 && val.toLowerCase() == val || 'Role name is not valid']"
            />
            <q-input v-model="newProposal.description" label="Description *" hint="additional info" filled type="text"
                     :rules="[val => val && val.length > 0 || 'Description is not valid']"
            />
            <q-input v-model="newProposal.info_url" label="Info URL" hint="link to ipfs" filled type="text"/>
            <q-input v-model.number="newProposal.hypha_salary" label="Hypha Salary" hint="amount per month" filled type="number" />
            <q-input v-model.number="newProposal.preseeds_salary" label="Preseeds Salary" hint="amount per month" filled type="number" />
            <q-input v-model.number="newProposal.voice_salary" label="Voice Salary" hint="amount per month" filled type="number" />
            <q-input v-model="newProposal.contribution_date" hint="contribution date" filled type="text" />
          </div>
          <q-card-actions align="right">
            <q-btn label="Create proposal" type="submit" color="primary" />
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
          name: 'description',
          field: 'description',
          label: 'Description'
        },
        {
          name: 'salary',
          field: row => `${row.hypha_salary} + ${row.preseeds_salary} + ${row.voice_salary}`,
          label: 'Salary'
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
  mounted () {
    if (this.isWalletConnected) {
      this.$store.dispatch('roles/loadActive')
      this.$store.dispatch('roles/loadProposals')
    }
  },
  computed: mapState({
    isWalletConnected: state => state.wallet.isConnected,
    activeRoles: state => state.roles.activeRoles,
    proposalRoles: state => state.roles.proposalRoles
  }),
  methods: {
    sendVote (...args) {
      console.log(JSON.stringify(...args))
    },
    sendProposal () {
      this.$store.dispatch('roles/sendProposal', this.newProposal)
    }
  },
  watch: {
    isWalletConnected () {
      this.$store.dispatch('roles/loadActive')
      this.$store.dispatch('roles/loadProposals')
    }
  }
}
</script>
