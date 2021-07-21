<script>
export default {
  name: 'page-members',
  components: {
    MembersList: () => import('~/components/profiles/members-list.vue'),
    MembersFilters: () => import('~/components/profiles/members-filter.vue')
  },

  data () {
    return {
      members: [
        {
          username: 'johnnyhypha1',
          name: 'Johnny Cage',
          avatar: 'avatar-placeholder.png'
        },
        {
          username: 'somedude1',
          name: 'Some Dude',
          avatar: 'avatar-placeholder.png'
        },
        {
          username: 'bobdude',
          name: 'Bob Dude',
          avatar: 'avatar-placeholder.png'
        },
        {
          username: 'girldude',
          name: 'Girl Dudeisjustmylastname',
          avatar: 'avatar-placeholder.png'
        },
        {
          username: 'longusernamedudemaybetoolong',
          name: 'Ya Ok',
          avatar: 'avatar-placeholder.png'
        },
        {
          username: 'johnnyhypha2',
          name: 'Johnny Beige',
          avatar: 'avatar-placeholder.png'
        }
      ],
      view: 'card'
    }
  }
}
</script>

<template lang="pug">
q-page.page-members
  .full-width.q-px-xl
    .row.items-center.justify-between
      q-breadcrumbs(align="left")
        q-breadcrumbs-el(:to="{ name: 'dho-home' }" label="Hypha DHO")
        q-breadcrumbs-el(label="Members")
      //.text-h4 Members
      q-btn-toggle(v-model="view"
        padding="10px"
        size="sm"
        toggle-color="primary"
        :options="[{ value: 'list', icon: 'fas fa-list' },{ value: 'card', icon: 'fas fa-th-large' }]"
      )
    .row.q-mt-sm
      .col-9.q-px-sm.q-py-md
        members-list(:members="members" :view="view")
      .col-3.q-pa-sm
        members-filters
</template>
