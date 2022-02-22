<script>
export default {
  name: 'sidebar-news',
  props: {
    username: String,
    daoName: String
  }
}
</script>

<template lang="pug">
.sidebar-news.full-width.q-px-lg
  .row
    .text-h6.text-bold Hey {{username}}, welcome to {{daoName}}
  .row.items-center.q-my-md
    .text-grey-6.text-body2 - Nice to see you here. Go take a look around. This DAO is here to help you govern your decentralized organisation, reduce coordination cost and build your organisation.
  .row.items-center.q-my-md
    .text-grey-6.text-body2 - You can vote for proposals (link proposal list), find other members (link members list) and find out what makes your organisation what it is (link to /organization)
  .row.items-center.q-my-md
    .text-grey-6.text-body2 - Go to your profile (link to /@Profile) and make sure its complete.
  .row.items-center.q-my-md
    .text-grey-6.text-body2 - And most importantly - have fun and do the DHO.
</template>
