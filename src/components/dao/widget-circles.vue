<script>
import { mapActions, mapGetters } from 'vuex'
import gql from 'graphql-tag'

const STATES = Object.freeze({
  WAITING: 'WAITING',
  CREATING_CIRCLE: 'CREATING_CIRCLE'
})

const CIRCLE = {
  name: '',
  description: ''
}

export default {
  name: 'widget-circles',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    form: {
      type: Object,
      default: () => {}
    },

    isAdmin: {
      type: Boolean,
      default: false
    }
  },

  apollo: {
    circles: {
      query: gql`
        query CIRCLES($daoId: Int64!) {
          queryCircle(
            filter: { 
              details_dao_i: { eq: $daoId }, 
              details_autoApprove_i: { eq: 1 } 
            }
          ) {
            id: docId
            name: details_title_s
            description: details_description_s

            memberAggregate {
              count
            }
          }
        }`,
      update: data => data.queryCircle,
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      subscribeToMore: {
        document: gql`
        subscription CIRCLES($daoId: Int64!) {
            queryCircle(
              filter: { 
                details_dao_i: { eq: $daoId }, 
                details_autoApprove_i: { eq: 1 } 
              }
            ) {
              id: docId
              name: details_title_s
              description: details_description_s

              memberAggregate {
                count
              }
            }
          }`,
        skip () { return !this.selectedDao?.docId },
        variables () { return { daoId: this.selectedDao.docId } },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }

          return subscriptionData.data
        }
      }
    }
  },

  data () {
    return {
      STATES,
      state: STATES.WAITING,

      circle: { ...CIRCLE }
    }
  },

  methods: {
    ...mapActions('dao', ['createCircle', 'deleteCircle']),

    async _createCircle () {
      try {
        await this.createCircle({ data: { ...this.circle } })
        this.cirlce = { ...CIRCLE }
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }

      this.state = STATES.WAITING
    },

    async _deleteCircle (id) {
      try {
        await this.deleteCircle(id)
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }

      this.state = STATES.WAITING
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),

    hasCircles () { return this.circles && this?.circles.length > 0 },
    circleCount () { return this.circles ? this.circles?.length : 0 }
  }

}
</script>

<template lang="pug">
widget(:title="$t('configuration.settings-structure.circles.title')" titleImage='/svg/chart-network.svg' bar).q-pa-none.full-width.q-mt-sm
  p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-structure.circles.description') }}
  .hr.q-my-md

  section.q-mt-md
    header.column.justify-center.text-center.items-center(v-if="!hasCircles && state === STATES.WAITING")
      p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-structure.circles.heading') }}
      q-btn.q-px-xl.text-bold(
        :label="$t('configuration.settings-structure.circles.nav.create')"
        @click="state = STATES.CREATING_CIRCLE"
        color="primary"
        icon="fas fa-plus"
        no-caps
        rounded
        unelevated
        v-if="isAdmin"
      )

    section(v-if="hasCircles").row.q-col-gutter-md
      template(v-for="circle in circles")
        article.col-12
          widget(:title="circle.name" shadow bar)
            template(v-slot:header)
              q-btn.q-pa-xs.relative-position(
                icon="fas fa-ellipsis-v"
                color="primary"
                flat
                dense
                round
                size="sm"
                v-if="isAdmin"
              )
                q-menu
                  q-list(dense)
                    q-item(@click="_deleteCircle(circle.id)" clickable v-close-popup)
                      q-item-section {{ $t('actions.delete') }}

            p.q-pa-none.text-sm.text-h-gray.leading-loose {{ circle.description }}
            .hr.q-my-md
            .row.items-center.q-mt-md
              q-avatar.q-mr-sm.bg-h-gray(size="md" text-color="white" icon="fas fa-user")
              p.q-pa-none.q-ma-none.text-sm.text-primary.text-bold.leading-loose {{ circle?.memberAggregate?.count }}  {{ $t('dao.member') }}

    section(v-if="state === STATES.CREATING_CIRCLE")
      .hr.q-my-md(v-if="hasCircles")

      .full-width
        label.h-label {{ $t('configuration.settings-structure.circles.form.name.label') }}
        q-input.q-my-xs(
          :debounce="200"
          :placeholder="$t('configuration.settings-structure.circles.form.name.placeholder')"
          bg-color="white"
          color="accent"
          dense
          lazy-rules
          outlined
          ref="name"
          rounded
          v-model='circle.name'
        )

      .full-width.q-mt-md
        label.h-label {{ $t('configuration.settings-structure.circles.form.description.label') }}
        q-input.q-my-xs(
          :debounce="200"
          :input-style="{ 'resize': 'none' }"
          :placeholder="$t('configuration.settings-structure.circles.form.description.placeholder')"
          bg-color="white"
          color="accent"
          dense
          lazy-rules
          maxlength="300"
          outlined
          ref="nickname"
          rounded
          rows="3"
          type="textarea"
          v-model='circle.description'
        )

      nav.full-width.q-my-xl.row.justify-end
        q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-mr-xs(
          :label="$t('configuration.settings-structure.circles.form.cancel')"
          @click="state = STATES.WAITING"
          color="white"
          no-caps
          rounded
          text-color="primary"
          unelevated
        )
        q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-ml-xs(
          :label="$t('configuration.settings-structure.circles.form.submit')"
          @click="_createCircle"
          color="secondary"
          no-caps
          rounded
          unelevated
        )

    nav.full-width.row.justify-end.q-mt-xl(v-if="hasCircles && state === STATES.WAITING")
      q-btn.q-px-xl.text-bold(
        :label="$t('configuration.settings-structure.circles.nav.create')"
        @click="state = STATES.CREATING_CIRCLE"
        color="primary"
        icon="fas fa-plus"
        no-caps
        rounded
        unelevated
        v-if="isAdmin"
      )

</template>

<style lang="stylus" scoped>
</style>
