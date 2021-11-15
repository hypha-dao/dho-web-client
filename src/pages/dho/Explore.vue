<script>
export default {
  name: 'page-explore',
  components: {
    DhoCard: () => import('~/components/navigation/dho-card.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      dhos: [
        {
          name: 'Hypha DHO',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: '',
          color: 'primary'
        },
        {
          name: 'Seeds',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: '',
          color: 'green-9'
        },
        {
          name: 'Tesla',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: '',
          color: 'red-8'
        },
        {
          name: 'Nike',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: '',
          color: 'black'
        }
      ]
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
      widget(title="Filters")
      widget.q-my-md(title="Create your DHO")
        .text-ellipsis.text-grey-7 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        q-btn.q-mt-xl.q-px-lg(rounded color="primary" no-caps) New DHO
</template>
