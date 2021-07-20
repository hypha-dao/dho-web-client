<script>
export default {
  name: 'active-proposals',
  components: {
    ProposalList: () => import('~/components/proposals/proposal-list'),
    ProposalFilters: () => import('~/components/proposals/proposal-filters')
  },

  data () {
    return {
      proposals: [
        {
          uid: '0x41',
          type: 'Contribution',
          title: 'Bridge contribution for Jan 1 - Jan 31 2020 Development of Seeds Wallet',
          proposer: {
            username: 'johnnyhypha1',
            name: 'Johnny Cage',
            avatar: 'avatar-placeholder.png'
          },
          voting: {
            vote: 'pass',
            approval: 0.874,
            quorum: 0.232
          }
        },
        {
          uid: '0x42',
          type: 'Assignment',
          title: 'Blacksmith',
          subtitle: 'Building and Developing B3',
          proposer: {
            username: 'johnnyhypha1',
            name: 'Johnny Cage',
            avatar: 'avatar-placeholder.png'
          },
          voting: {
            vote: null,
            approval: 1.00,
            quorum: 0.12
          }
        },
        {
          uid: '0x43',
          type: 'Quest',
          title: 'Development for the month of May 2021',
          proposer: {
            username: 'johnnyhypha1',
            name: 'Johnny Cage',
            avatar: 'avatar-placeholder.png'
          },
          voting: {
            vote: 'abstain',
            approval: 0.343,
            quorum: 0.32
          }
        },
        {
          uid: '0x42',
          type: 'Badge',
          title: 'Ambassador',
          proposer: {
            username: 'johnnyhypha1',
            name: 'Johnny Cage',
            avatar: 'avatar-placeholder.png'
          },
          voting: {
            vote: 'fail',
            approval: 0.75,
            quorum: 0.12
          }
        }
      ],
      view: 'list'
    }
  }
}
</script>

<template lang="pug">
.active-proposals.full-width.q-px-xl
  .row.items-center.justify-between
    q-breadcrumbs(align="left")
      q-breadcrumbs-el(:to="{ name: 'dho-home' }" label="Hypha DHO")
      q-breadcrumbs-el(label="Proposals")
    // .text-h4 Proposals
    q-btn-toggle(v-model="view"
      padding="10px"
      size="sm"
      toggle-color="primary"
      :options="[{ value: 'list', icon: 'fas fa-list' },{ value: 'card', icon: 'fas fa-th-large' }]"
    )
  .row.q-mt-sm
    .col-9.q-px-sm.q-py-md
      proposal-list(:proposals="proposals" :view="view")
    .col-3.q-pa-sm
      proposal-filters
</template>
