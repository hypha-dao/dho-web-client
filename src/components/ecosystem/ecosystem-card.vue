<script>
import { dateToStringShort } from '~/utils/TimeUtils'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'ecosystem-card',
  props: {
    data: Object
  },
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  methods: {
    ipfsy,
    formatDate (date) {
      return dateToStringShort(date)
    },
    parseDomain (domain) {
      switch (domain) {
        case 'SOCIO_ECOLOGICAL':
          return 'Socio-Ecological'
        case 'SOCIO_ECONOMICAL':
          return 'Socio-Economical'
        case 'SOCIO_POLITICAL':
          return 'Socio-Political'
        case 'SOCIO_PSYCHOLOGICAL':
          return 'Socio-Psychological'
      }
    }
  }
}
</script>
<template lang="pug">
widget.full-width.relative
  div.absolute.justify-center.items-center.flex(:style="{ 'width': '40px', 'height': '40px', 'border-radius': '50%', 'background': '#F1F1F3', 'right': '-15px', 'top': '-15px' }")
    q-icon(name="fas fa-globe" size="20px")
  .row.items-center
    .col-9.q-pr-xl.row.items-center
      .col-auto
        q-avatar(size="160px" color='primary')
          img(:src="ipfsy(data.logo)" v-if="data.logo").object-cover
      .col.q-ml-md
        .row.items-center.q-mb-md
          .h-h4 {{ data.name }}
          .row.q-ml-md
            q-icon.q-py-xs(v-if="data.domain === 'SOCIO_ECOLOGICAL'" name="fas fa-leaf")
            .text-xs.q-ml-xs.q-mt-xs {{ parseDomain(data.domain) }}
        .text-xs.text-h-gray {{ data.purpose }}
    q-separator(:vertical="true" color="grey-3" inset)
    .col
      .column.justify-between.full-width.full-height.items-center
        div
          .row.items-center
            .h-h4.q-mb-sm {{ data.daosCount }} DAOs
          .row.items-center
            q-icon.q-py-xs(color="primary" name="fas fa-calendar-alt")
            .text-xs.text-h-gray.q-px-xs {{ formatDate(data.createdDate) }}
          .row.items-center
            q-icon.q-py-xs(color="grey-7" name="fas fa-users")
            .text-xs.text-h-gray.q-px-xs {{ data.coreMembersCount }} Core members
          .row.items-center
            q-icon.q-py-xs(color="grey-7" name="fas fa-users")
            .text-xs.text-h-gray.q-px-xs {{ data.comMembersCount }} Community members
</template>
<styles lang="stylus">
</styles>
