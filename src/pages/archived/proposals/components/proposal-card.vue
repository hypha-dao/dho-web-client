<template lang="pug">
q-card
  q-card-section
    .text-h6.text-center {{ proposal.role_name }}
  q-card-section.flex.justify-end
    p.desc {{ proposal.description | truncate }}
    q-btn(
      color="primary"
      label="read more"
      rounded
      dense
      flat
      size="sm"
    )
  q-card-section.flex.justify-between
    strong By {{ proposal.proposer }}
    i {{ new Date(proposal.created_date).toLocaleString() }}
  q-card-actions.flex.justify-end
    q-btn(
      color="primary"
      flat
      round
      dense
      size="sm"
      icon="far fa-thumbs-up"
    )
    q-btn(
      color="primary"
      flat
      round
      dense
      size="sm"
      icon="fa fa-ellipsis-v"
    )
      q-menu
        q-list
          q-item(
            @click=""
            clickable
            v-close-popup
          )
            q-item-section(avatar)
              q-icon(
                name="far fa-edit"
                color="primary"
                size="xs"
              )
            q-item-section Needs improvement
          q-item(
            @click=""
            clickable
            v-close-popup
          )
            q-item-section(avatar)
              q-icon(
                name="fa fa-minus"
                color="primary"
                size="xs"
              )
            q-item-section No opinion
          q-item(
            @click=""
            clickable
            v-close-popup
          )
            q-item-section(avatar)
              q-icon(
                name="far fa-thumbs-down"
                color="primary"
                size="xs"
              )
            q-item-section Disapprove

</template>

<script>
import { format } from '~/mixins/format'

export default {
  name: 'proposal-card',
  mixins: [format],
  props: {
    proposal: { type: Object, required: true }
  },
  data () {
    return {
      details: null
    }
  }
}
</script>

<style lang="stylus" scoped>
.desc
  height 100px
</style>
