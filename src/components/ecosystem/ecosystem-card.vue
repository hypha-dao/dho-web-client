<script>
import { ECOSYSTEM_DOMAIN, parseEcosystemDomain } from '~/const'
import ipfsy from '~/utils/ipfsy'
import { dateToStringShort } from '~/utils/TimeUtils'

export default {
  name: 'ecosystem-card',
  props: {
    data: Object
  },

  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      ECOSYSTEM_DOMAIN
    }
  },

  methods: {
    formatDate (date) { return dateToStringShort(date) },
    ipfsy,
    parseEcosystemDomain,
    getIconPath (domain) {
      switch (domain) {
        case (this.ECOSYSTEM_DOMAIN.SOCIO_ECOLOGICAL):
          return require('~/assets/icons/ecosystem/socio-ecological.svg')
        case (this.ECOSYSTEM_DOMAIN.SOCIO_ECONOMICAL):
          return require('~/assets/icons/ecosystem/socio-economic.svg')
        case (this.ECOSYSTEM_DOMAIN.SOCIO_POLITICAL):
          return require('~/assets/icons/ecosystem/socio-political.svg')
        case (this.ECOSYSTEM_DOMAIN.SOCIO_PSYCHOLOGICAL):
          return require('~/assets/icons/ecosystem/socio-psychological.svg')
      }
      return ''
    }
  },

  computed: {}
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
          .row.q-ml-xs
            img.q-pt-xxs(:src="getIconPath(data.domain)")
            .text-xs.q-ml-xxs.q-mt-xs {{ parseEcosystemDomain(data.domain) }}
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
