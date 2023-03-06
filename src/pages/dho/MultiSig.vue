<script>
import { mapActions, mapGetters } from 'vuex'
import { truncate } from '~/mixins/truncate'

export default {
  name: 'page-multi-sig',
  mixins: [truncate],
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      expandedName: undefined,
      loading: true,
      proposals: [],
      state: 'WAITING',
      submitting: false,
      columns: [
        { name: 'type', label: 'Type', field: 'type', align: 'left' },
        { name: 'proposal_name', label: 'Name', field: 'proposal_name', align: 'left' },
        { name: 'proposer', label: 'Proposer', field: 'proposer', align: 'left' },
        { name: 'developer', label: 'developer', field: 'developer', align: 'left' },
        { name: 'notes', label: 'notes', field: 'notes', align: 'left' },
        { name: 'links', label: 'Links', field: 'links', align: 'left' },
        { name: 'approvals', label: 'approvers', field: 'approvals', align: 'left' }
      ],
      pagination: {
        rowsPerPage: 20,
        sortBy: 'proposal_name'
      }

    }
  },

  async beforeMount () {
    this.proposals = await this.getHyphaProposals()
    const hasRequest = this.hasRequest(this.proposals)
    this.state = hasRequest ? 'WAITING' : 'NO_TRANSACTIONS'
    this.loading = false
  },

  methods: {
    ...mapActions('multiSig', ['getHyphaProposals', 'approve']),

    async onConfirm (proposal) {
      this.state = 'CONFIRMING'
      this.selectedProposal = proposal
    },

    async onApprove () {
      try {
        const proposal = this.selectedProposal
        this.submitting = true
        const level = this.getLevel(proposal, 'approve')
        await this.approve({ proposer: proposal.proposer, proposalName: proposal.proposal_name, level })
        this.submitting = false
        this.state = 'NO_TRANSACTIONS'
      } catch (error) {

      }
    },

    openUrl (url) {
      window.open(url, '_blank')
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

    getKeyValue (proposal, key) {
      if (!proposal.document) return null
      const content = proposal.document.content_groups[0]
      if (!content) return null
      const data = content.find(c => c.label === key)
      return data && data.value.length > 0 && data.value[1]
    },

    isActor (actor) {
      return actor === this.account
    },

    isApprover (proposal) {
      return proposal.requested_approvals.some(a => a.level.actor === this.account) || proposal.provided_approvals.some(a => a.level.actor === this.account)
    },

    isProposer (proposal) {
      return proposal.proposer === this.account
    },

    canBeExecuted (proposal) {
      return proposal.provided_approvals.length >= proposal.requested_approvals.length
    },

    hasApproved (proposal) {
      return proposal.provided_approvals.some(a => a.level.actor === this.account)
    },

    hasRequest (proposals) {
      return proposals.map(proposal => [...proposal.requested_approvals, ...proposal.provided_approvals]).flat().some(a => a.level.actor === this.account)
    },

    getInitials (name) {
      return name.slice(0, 2)
    },

    onClose () {
      this.$router.go(-1)
    },

    onExpand (proposal) {
      if (proposal.proposal_name === this.expandedName) {
        this.expandedName = undefined
        return
      }
      this.expandedName = proposal?.proposal_name
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isAdmin', 'isMember']),
    ...mapGetters('dao', ['selectedDao', 'daoSettings'])
  }

}
</script>

<template lang="pug">
.page-multi-sig.row
  .col-12(v-if="!$q.screen.gt.md" :style="{ marginBottom: '200px'}")
    widget.q-pa-none
      .h-h6.q-ml-xs Transactions
      q-btn.absolute.q-pa-xxxs.close-btn(
        flat rounded size="sm"
        icon="fas fa-times"
        text-color="primary"
        @click="onClose"
      )
      .multi-sig
        .row.full-width.q-tr--no-hover(v-for="p in proposals" @click="() => onExpand(p)").item.cursor-pointer
          .col-6
            .row
              .h-label.q-ma-none {{ p.proposal_name }}
            .row
              .h-b1.q-ma-none {{ p.proposer }}
          .col-6.flex.justify-end
            q-btn(@click="openUrl(getKeyValue(p, 'github_commit'))" flat round color="primary" v-if="getKeyValue(p, 'github_commit')")
              q-icon(center name="fab fa-github" size="24px")
            q-btn(@click="openUrl(getKeyValue(p, 'document'))" flat round color="primary" v-if="getKeyValue(p, 'github_commit')")
              q-icon(center name="fas fa-file-alt" size="24px")

          .col-12.justify-center.flex.unexpanded-icon(v-if="expandedName !== p.proposal_name")
            q-icon.expand-icon(:name="'fas fa-chevron-down'" color="grey-7")
          .expanded.row(v-if="expandedName === p.proposal_name")
            .col-12.q-mt-sm
              .h-label.q-ma-none Developer
              .h-b1.q-ma-none {{ getKeyValue(p, 'developer') }}
            .col-12.q-mt-sm
              .h-label.q-ma-none Note
              .h-b1.q-ma-none {{ truncate (getKeyValue(p, 'notes'), 40) }}
            .col-12.q-mt-sm(v-if="p.provided_approvals.length || p.requested_approvals.length")
              q-btn.approbal-badge.bg-primary.text-white.cursor-inherit(
                :key="approval.level.actor"
                padding="none"
                round
                unelevated
                v-for="approval in p.provided_approvals"
              ) {{ getInitials(approval.level.actor) }}
                q-tooltip Approved the {{ new Date(approval.time.slice(0, -4)).toLocaleDateString() }} by {{ approval.level.actor }}

              q-btn.approbal-badge.bg-disabled.text-white(
                :disable="!isActor(approval.level.actor)"
                :key="approval.level.actor"
                @click="onConfirm(p)"
                padding="none"
                round
                unelevated
                v-for="approval in p.requested_approvals"
                ) {{ getInitials(approval.level.actor) }}
                q-tooltip Requesting approval of {{ approval.level.actor }}
          .col-12.justify-center.flex.q-mt-md(v-if="expandedName === p.proposal_name")
            q-icon.expand-icon(:name="'fas fa-chevron-down' + ' fa-rotate-180'" color="grey-7")
  //- This had to be duplicated for desktop because the design is very different, using only flex grids won't work
  .col-9.q-pr-md(v-if="$q.screen.gt.md")
    widget.q-pa-none
      q-table.multi-sig(
        :columns="columns "
        :data="proposals"
        :hide-bottom="true"
        :loading="loading"
        :pagination.sync="pagination"
        row-key="proposal.proposal_name"
        virtual-scroll
      )
        template(v-slot:body="props")
          q-tr(:props="props").q-tr--no-hover
            q-td(key="type" :props="props" v-if="$q.screen.gt.md")
                q-img.logo(v-if="props.row.type === 'HYPHA'" src="~assets/icons/vote.png" size='10px')
                q-img.logo(v-if="props.row.type === 'SEED'" src="~assets/icons/seeds.png" size='10px')

            q-td(key="proposal_name" :props="props")
              p.q-py-md.q-ma-none {{ props.row.proposal_name }}

            q-td(key="proposer" :props="props")
              p.q-py-md.q-ma-none.text-heading.text-bold {{ props.row.proposer }}

            q-td(key="developer" :props="props")
              p.q-py-md.q-ma-none {{ getKeyValue(props.row, 'developer') }}

            q-td(key="notes" :props="props")
              p.q-py-md.q-ma-none {{ truncate (getKeyValue(props.row, 'notes'), 40) }}

            q-td(key="links" :props="props")
              q-btn(@click="openUrl(getKeyValue(props.row, 'github_commit'))" flat round v-if="getKeyValue(props.row, 'github_commit')")
                q-icon(center name="fab fa-github" size="20px")
              q-btn(@click="openUrl(getKeyValue(props.row, 'document'))" flat round v-if="getKeyValue(props.row, 'document')")
                q-icon(center name="fas fa-file-alt" size="20px")

            q-td(key="approvals" :props="props")

              q-btn.approval.bg-primary.text-white.cursor-inherit(
                :key="approval.level.actor"
                padding="none"
                round
                unelevated
                v-for="approval in props.row.provided_approvals"
              ) {{ getInitials(approval.level.actor) }}
                q-tooltip Approved the {{ new Date(approval.time.slice(0, -4)).toLocaleDateString() }} by {{ approval.level.actor }}

              q-btn.approval.bg-disabled.text-white(
                :disable="!isActor(approval.level.actor)"
                :key="approval.level.actor"
                @click="onConfirm(props.row)"
                padding="none"
                round
                unelevated
                v-for="approval in props.row.requested_approvals"
                ) {{ getInitials(approval.level.actor) }}
                q-tooltip Requesting approval of {{ approval.level.actor }}

  .col-12.col-lg-3.pl-md(v-show='!loading' :class="{ 'mobile-bottom-widget q-mt-lg': !$q.screen.gt.md }")
    widget.bg-primary(v-show="state === 'WAITING'")
      h2.h-h4.text-white Click on your initials <br/> to sign a transaction
      p.h-b2.mt-xl.text-disabled Multisig enables us to sign transactions in a secure way. To release new PRs we need at least 3 signatures.

    widget.bg-primary(v-show="state === 'CONFIRMING'")
      h2.h-h4.text-white Do you really want to <br/> sign this transaction?
      p.h-b2.mt-xl.text-disabled Multisig enables us to sign transactions in a secure way. To release new PRs we need at least 3 signatures.
      q-btn.q-mt-xl.text-primary.text-bold.full-width(:loading="submitting" @click="onApprove()" color="white" text-color='primary' no-caps rounded) Sign

    widget(v-show="state === 'NO_TRANSACTIONS'")
      h2.h-h4 No Transactions to <br/> sign at the moment
      p.h-b2.mt-xl.text-subtitle Multisig enables us to sign transactions in a secure way. To release new PRs we need at least 3 signatures.
</template>

<style lang="stylus" scoped>
.unexpanded-icon
  margin-top: -8px;
  height: 0;
.close-btn
  right: -30px;
  top: -100px;
  background-color: white;
.mobile-bottom-widget
  position: fixed;
  bottom: 0;
  left:0;
  z-index: 3000;

  .widget
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;

h2
  line-height: 32px;

.text-subtitle
  color: #84878E;

/deep/table
  border-collapse: separate;
  border-spacing: 0 10px;

/deep/th
  font-size: 13px;
  font-weight: bold;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: #3E3B46;
  border: none;
  &:first-child, &:last-child
    padding-left: 30px;

.item
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1.5rem;
  background: $internal-bg;
  border-radius: 20px;
  padding-left: 30px;

.multi-sig
  box-shadow: none;
  border: none;
  tr
    padding: 30px;
  thead

  tbody
    td
      border: none;
      background: $internal-bg;
    td:first-child
      border-radius: 20px 0 0 20px;
      padding-left: 30px;
    td:last-child
      border-radius: 0 20px 20px 0;
      padding-left: 30px;

.approbal-badge
  border: 1px solid $internal-bg;
  position: relative
  z-index: 100;
  opacity: 1 !important;
  font-size: 13px;
  width: 32px
  height: 32px;
.approval
  border: 1px solid $internal-bg;
  margin-left: -4px;
  position: relative
  z-index: 100;
  opacity: 1 !important;
  font-size: 13px;
  width: 22px
  height: 22px;

.logo
  max-width: 20px
  max-height: 20px;
  object-fit: contain
</style>
