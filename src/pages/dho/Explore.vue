<script>
export default {
  name: 'page-explore',
  components: {
    DhoCard: () => import('~/components/navigation/dho-card.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue')
  },

  data () {
    return {
      optionArray: ['Sort alphabetically'],
      sort: '',
      daoName: ''
    }
  },
  apollo: {
    dhos: {
      query: require('~/query/dao/dao-list.gql'),
      update: data => {
        const mapdhos = data.queryDao.map(dao => {
          return {
            name: dao.details_daoName_n,
            members: dao.memberAggregate.count,
            date: dao.createdDate,
            description: dao.settings[0].settings_daoDescription_s
          }
        })

        return mapdhos
      }
    }
  },
  methods: {
    updateSort (selectedSort) {
      this.sort = selectedSort
    },
    updateDaoName (daoName) {
      this.daoName = daoName
    }
  },
  meta: {
    title: 'Explore'
  }
}
</script>

<template lang="pug">
.page-explore.full-width
  .row.q-mt-sm
    .col-9.q-px-sm.q-py-md
      .row.q-gutter-md
        template(v-for="dho in dhos")
          dho-card(v-bind="dho")
    .col-3.q-pa-sm.q-py-md
      filter-widget(
        filterTitle="Search DHOs"
        :optionArray.sync="optionArray"
        :showToggle="false"
        :showViewSelector="false"
        :showCircle="false"
        @update:sort="updateSort"
        @update:textFilter="updateDaoName"
      )
      widget.q-my-md(title="Create your DHO")
        .text-ellipsis.text-grey-7 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        q-btn.q-mt-xl.q-px-lg(rounded color="primary" no-caps) New DHO
</template>
