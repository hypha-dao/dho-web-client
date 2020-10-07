<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'multi-sig-list',
  data () {
    return {
      loading: true,
      proposals: [],
      columns: [
        { name: 'type', label: 'Type', field: 'type', align: 'left' },
        { name: 'proposal_name', label: 'Name', field: 'proposal_name', align: 'left' },
        { name: 'proposer', label: 'Proposer', field: 'proposer', align: 'left' },
        { name: 'developer', label: 'developer', field: 'developer', align: 'left' },
        { name: 'notes', label: 'notes', field: 'notes', align: 'left' },
        { name: 'links', label: 'Links', field: 'links', align: 'left' },
        { name: 'approvals', label: 'approvals', field: 'approvals', align: 'left' },
        { name: 'actions', label: 'actions', field: 'actions', align: 'right' }
      ],
      pagination: {
        rowsPerPage: 20,
        sortBy: 'proposal_name'
      },
      submitting: false
    }
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Multi Sig' }])
    this.proposals = await this.getHyphaProposals()
    this.loading = false
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('multiSig', ['getHyphaProposals', 'approve', 'unapprove', 'execute', 'cancel']),
    async onApprove (proposal) {
      this.submitting = true
      const level = this.getLevel(proposal, 'approve')
      await this.approve({ proposalName: proposal.proposal_name, level })
      this.submitting = false
    },
    async onUnapprove (proposal) {
      this.submitting = true
      const level = this.getLevel(proposal, 'unapprove')
      await this.unapprove({ proposalName: proposal.proposal_name, level })
      this.submitting = false
    },
    async onExecute (proposal) {
      this.submitting = true
      await this.execute({ proposalName: proposal.proposal_name })
      this.submitting = false
    },
    async onCancel (proposal) {
      this.submitting = true
      await this.cancel({ proposalName: proposal.proposal_name })
      this.submitting = false
    },
    openUrl (url) {
      window.open(url, '_blank')
    },
    getKeyValue (proposal, key) {
      if (!proposal.document) return null
      const content = proposal.document.content_groups[0]
      if (!content) return null
      const data = content.find(c => c.label === key)
      return data && data.value.length > 0 && data.value[1]
    },
    isApprover (proposal) {
      return proposal.requested_approvals.some(a => a.level.actor === this.account) || proposal.provided_approvals.some(a => a.level.actor === this.account)
    },
    getLevel (proposal, type) {
      let obj
      if (type === 'approve') {
        obj = proposal.requested_approvals.find(a => a.level.actor === this.account)
      } else {
        obj = proposal.provided_approvals.find(a => a.level.actor === this.account)
      }
      return obj && obj.level.permission
    },
    isProposer (proposal) {
      return proposal.proposer === this.account
    },
    canBeExecuted (proposal) {
      return proposal.provided_approvals.length >= proposal.requested_approvals.length
    },
    hasApproved (proposal) {
      return proposal.provided_approvals.some(a => a.level.actor === this.account)
    }
  },
  computed: {
    ...mapGetters('accounts', ['account'])
  }
}
</script>

<template lang="pug">
.q-pa-lg
  q-table.multi-sig.q-mt-xl(
    :data="proposals"
    :columns="columns"
    row-key="proposal.proposal_name"
    virtual-scroll
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    :loading="loading"
  )
    template(v-slot:body="props")
      q-tr(:props="props")
        q-td(key="type" :props="props")
          img.table-icon(v-if="props.row.type === 'HYPHA'" src="~assets/icons/hypha.svg")
          img.table-icon(v-if="props.row.type === 'SEED'" src="~assets/icons/seeds.png")
        q-td(key="proposal_name" :props="props")
          | {{ props.row.proposal_name }}
        q-td(key="proposer" :props="props")
          | {{ props.row.proposer }}
        q-td(key="developer" :props="props")
          | {{ getKeyValue(props.row, 'developer') }}
        q-td(key="notes" :props="props")
          | {{ getKeyValue(props.row, 'notes') }}
        q-td(key="links" :props="props")
          q-btn(
            v-if="getKeyValue(props.row, 'github_commit')"
            icon="fab fa-github"
            round
            flat
            @click="openUrl(getKeyValue(props.row, 'github_commit'))"
          )
          q-btn(
            v-if="getKeyValue(props.row, 'document')"
            icon="fas fa-file-alt"
            round
            flat
            @click="openUrl(getKeyValue(props.row, 'document'))"
          )
        q-td(key="approvals" :props="props")
          q-avatar.approval.q-mr-xs(
            v-for="approval in props.row.provided_approvals"
            :key="approval.level.actor"
            color="accent"
            text-color="white"
            size="25px"
          )
            | {{ approval.level.actor.slice(0, 2) }}
            q-tooltip Approved the {{ new Date(approval.time.slice(0, -4)).toLocaleDateString() }} by {{ approval.level.actor }}
          q-avatar.approval.q-mr-xs(
            v-for="approval in props.row.requested_approvals"
            :key="approval.level.actor"
            color="grey"
            text-color="white"
            size="25px"
          )
            | {{ approval.level.actor.slice(0, 2) }}
            q-tooltip Requesting approval of {{ approval.level.actor }}
        q-td(key="actions" :props="props")
          .flex.column
            q-btn.q-mb-xs(
              v-if="isApprover(props.row) && !hasApproved(props.row)"
              label="approve"
              color="green"
              unelevated
              rounded
              @click="onApprove(props.row)"
              :loading="submitting"
            )
            q-btn.q-mb-xs(
              v-if="isApprover(props.row) && hasApproved(props.row)"
              label="unapprove"
              color="orange"
              unelevated
              rounded
              @click="onUnapprove(props.row)"
              :loading="submitting"
            )
            q-btn.q-mb-xs(
              v-if="isProposer(props.row)"
              label="cancel"
              color="red"
              unelevated
              rounded
              @click="onCancel(props.row)"
              :loading="submitting"
            )
            q-btn.q-mb-xs(
              v-if="canBeExecuted(props.row)"
              label="execute"
              color="primary"
              unelevated
              rounded
              @click="onExecute(props.row)"
              :loading="submitting"
            )
</template>

<style lang="stylus" scoped>
.multi-sig
  background rgba(227,242,253,0.4)
  .q-table
    tbody
      td
        font-size 16px !important
  /deep/th
    font-weight 700
    text-transform uppercase
    font-size 16px
    text-align left
  .table-icon
    width auto
    max-width 25px
    max-height 25px
  .approval
    text-transform uppercase
</style>
