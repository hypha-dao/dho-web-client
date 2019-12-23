<script>
import { format } from '~/mixins/format'
import { mapActions } from 'vuex'

export default {
  name: 'proposal-card',
  mixins: [format],
  props: {
    proposal: { type: Object, required: true }
  },
  data () {
    return {
      loading: true,
      percentage: 'pending',
      fail: null,
      pass: null
    }
  },
  computed: {
    type () {
      const type = this.proposal.names.find(o => o.key === 'proposal_type')
      return type.value
    }
  },
  async mounted () {
    const ballot = this.proposal.names.find(o => o.key === 'ballot_id')
    if (ballot) {
      const result = await this.fetchBallot(ballot.value)
      if (result) {
        this.pass = result.options.find(o => o.key === 'pass').value
        this.fail = result.options.find(o => o.key === 'fail').value
        if (parseInt(this.pass) + parseInt(this.fail) > 0) {
          this.percentage = ((parseInt(this.pass) / (parseInt(this.pass) + parseInt(this.fail))) * 100).toFixed(0)
        }
      }
    }
    this.loading = false
  },
  methods: {
    ...mapActions('trail', ['fetchBallot'])
  }
}
</script>

<template lang="pug">
q-card.cursor-pointer(
  @click="$router.push({ path: `/proposal/${proposal.id}`})"
)
  q-card-section.text-center.bg-accent.text-white.relative-position(:class="`bg-${type}`")
    .text-h6 {{ proposal.strings.find(o => o.key === 'title').value }}
    i.type {{ type }}
  q-card-section.description.q-mt-md
    p {{ proposal.strings.find(o => o.key === 'description').value  }}
  q-card-section.text-center(
    v-if="loading"
  )
    q-spinner-dots(
      color="primary"
      size="40px"
    )
  q-card-section.text-center(v-else)
    q-knob(
      v-if="percentage !== 'pending'"
      readonly
      v-model="percentage"
      show-value
      size="130px"
      :thickness="0.22"
      color="green"
      track-color="red"
      :class="percentage > 50 ? 'text-green' : 'text-red'"
    )
      i {{ percentage }}%
      q-tooltip(
        anchor="center middle"
        self="center middle"
      )
        | {{ pass }} for / {{ fail }} against
    i(v-else) No votes cast yet
  q-card-section.text-right
    i {{ new Date(proposal.created_date).toDateString()}}
</template>

<style lang="stylus" scoped>
.description
  white-space pre-wrap
.type
  position absolute
  top 2px
  right 5px
  font-size 11px
</style>
