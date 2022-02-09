<script>
export default {
  name: 'page-search-results',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    Result: () => import('./components/result.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue')
  },
  data () {
    return {
      optionArray: ['Sort by last added'],
      circleArray: ['All circles'],
      results: [
        {
          icon: 'far fa-paper-plane',
          title: 'Title',
          type: 'type',
          tags: [
            {
              color: 'white',
              label: 'stagin',
              text: 'red',
              outline: false
            }
          ]
        },
        {
          icon: 'far fa-paper-plane',
          title: 'Title 2',
          type: 'type',
          tags: [
            {
              color: 'white',
              label: 'stagin',
              text: 'red',
              outline: false
            },
            {
              color: 'white',
              label: 'stagin',
              text: 'red',
              outline: false
            }
          ]
        },
        {
          icon: 'far fa-paper-plane',
          title: 'Title 3',
          type: 'type',
          tags: [
            {
              color: 'white',
              label: 'stagin',
              text: 'red',
              outline: false
            }
          ]
        },
        {
          icon: 'far fa-paper-plane',
          title: 'Title 4',
          type: 'type',
          tags: [
            {
              color: 'white',
              label: 'stagin',
              text: 'red',
              outline: false
            },
            {
              color: 'white',
              label: 'stagin',
              text: 'red',
              outline: false
            }
          ]
        }
      ],
      filters: [
        {
          label: 'All',
          enabled: true,
          filter: () => true
        },
        {
          label: 'Members',
          enabled: false,
          filter: (p) => p.__typename === ''
        },
        {
          label: 'One Time Active',
          enabled: false,
          filter: (p) => p.__typename === ''
        },
        {
          label: 'Recurring Activity',
          enabled: false,
          filter: (p) => p.__typename === ''
        },
        {
          label: 'Organizational',
          enabled: false,
          filter: (p) => p.__typename === ''
        }
      ]
    }
  }
}
</script>

<template lang="pug">
q-page.page-search-results
  .row.q-mt-sm
    .col-9.q-px-sm.q-py-md
      widget(:title="`${results.length} Results`")
        div( style="max-height: 400px; overflow: auto;" ref="scrollTargetRef")
          q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollTargetRef")
            result(v-for="result in results" :key="result.title" v-bind="result")
    .col-3.q-pa-sm.q-py-md
      filter-widget(
        filterTitle="Search DHOs"
        :optionArray="optionArray"
        :circleArray="circleArray"
        :showToggle="false"
        :showViewSelector="false"
        :chipsFiltersLabel="'Results types'"
        :filters.sync="filters"
        :showTextFilter="false"
      )
</template>
