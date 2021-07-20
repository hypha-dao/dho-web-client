<script>
export default {
  name: 'proposal-detail',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    Payout: () => import('~/components/contributions/payout.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    VoterList: () => import('~/components/proposals/voter-list.vue'),
    Voting: () => import('~/components/proposals/voting.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    uuid: String
  },

  data () {
    return {
      uid: '0x41',
      type: 'Contribution',
      title: 'Bridge contribution for Jan 1 - Jan 31 2020 Development of Seeds Wallet',
      description: `Res ultor rotae Iovemque palude lingua. Animas astu ne squamae noctis, in iacent torta vidi tantum addidit cruentior taceam, vertit!

Quaecumque quoque murra descendunt tulit rem nefanda
Posses natam tractus potentior gramina nullaque satis
In dixere gaudia
Angues et ulla
Frustra plumbum
Viderat foret sit hospes cum
Est iam, deae quaerit texerat. Sustinet hac quota vero egredior aurea non veram repono turbata. Excutit eurytus, non senex facta, et toroque tenuit et gentes volumine.

Palato in dare dum Orontes amissa, prement est se posses detulit figuras diuque; cum. Aequos aliquem iubemur pelago iurgia conscia, aquas lucum resumpta.`,
      proposer: {
        username: 'johnnyhypha1',
        name: 'Johnny Cage',
        avatar: 'avatar-placeholder.png'
      },
      tokens: [
        {
          label: 'husd',
          value: 1745.45,
          icon: 'husd.svg'
        },
        {
          label: 'hvoice',
          value: 5124.24,
          icon: 'hvoice.svg'
        },
        {
          label: 'hypha',
          value: 120.32,
          icon: 'hypha.svg'
        }
      ],
      voting: {
        vote: 'pass',
        approval: 0.874,
        quorum: 0.232
      },
      votes: [
        {
          voter: {
            username: 'johnnyhypha1',
            name: 'Johnny Cage',
            avatar: 'avatar-placeholder.png'
          },
          vote: 'pass'
        }
      ]
    }
  }
}
</script>

<template lang="pug">
.proposal-detail.full-width.q-px-xl
  .row.items-center.justify-between
    q-breadcrumbs(align="left")
      q-breadcrumbs-el(:to="{ name: 'dho-home' }" label="Hypha DHO")
      q-breadcrumbs-el(:to="{ name: 'active-proposals' }" label="Proposals")
      q-breadcrumbs-el(label="Proposal Details")
    q-btn(@click="$router.go(-1)")
      .row.items-center
        q-icon(size="xs" name="fas fa-chevron-left")
        .text-body2 Back
  .row
    .col-3.q-pa-sm
      payout.q-my-sm(:tokens="tokens")
      widget.q-my-sm(title="Duration")
        .row.justify-between
          .row.items-center
            q-icon.on-left(name="far fa-calendar-alt")
            .text-body2 Jun 2 - Aug 13
          .text-bold 12 periods
      widget.q-my-sm(title="Proposer")
        profile-picture(v-bind="proposer" show-name size="64px")
    .col-6.q-pa-sm
      widget.q-my-sm
        .row
          chips(:tags="[{ color: 'warning', label: 'Contribution' }]")
        .row.q-my-sm
          .text-h6 {{ title }}
        .row
          .col-3.text-subtitle1.text-bold Objective
          .col-9.text-body2 Objective text
        .row
          .col-3.text-subtitle1.text-bold Key Results
          .col-9
            .text-body2 These are results
            ol
              li Result 1
              li Result 2
              li Result 3
        .row
          .col-3.text-subtitle1.text-bold Description
          .col-9.text-body2 {{ description }}
        q-btn.full-width.q-my-lg.q-mt-xl(outline padding="md" rounded label="See Documentation")
      widget.q-my-sm(title="Comments (2)")
        .comment.q-pa-sm
          profile-picture(v-bind="proposer" show-name size="24px")
          .text-italic 2 days ago
          .text-body2 Res ultor rotae Iovemque palude lingua. Animas astu ne squamae noctis, in iacent torta vidi tantum addidit cruentior taceam, vertit!
        .comment.q-pa-sm
          profile-picture(v-bind="proposer" show-name size="24px")
          .text-italic 2 days ago
          .text-body2 Res ultor rotae Iovemque palude lingua. Animas astu ne squamae noctis, in iacent torta vidi tantum addidit cruentior taceam, vertit!
    .col-3.q-pa-sm
      voting.q-my-sm
      voter-list.q-my-sm(:votes="votes")
</template>
