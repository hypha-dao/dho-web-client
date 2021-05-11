<script>
export default {
  name: 'voter-list',
  props: {
    votes: Array
  },

  data () {
    return {
      columns: [
        { name: 'date', label: 'Date', field: 'date', sortable: true, align: 'left' },
        { name: 'user', label: 'User', field: 'user', sortable: true, align: 'left' },
        { name: 'vote', label: 'Vote', field: 'vote', sortable: true, align: 'left' },
        { name: 'strength', label: 'HVoice', field: 'strength', sortable: true, align: 'left' }
      ]
    }
  }
}
</script>

<template lang="pug">
q-table(
  title="User Votes"
  :data="votes"
  :columns="columns"
  row-key="user"
)
</template>
