<script>
import { mapActions, mapGetters } from 'vuex'
import gql from 'graphql-tag'

const STATES = Object.freeze({
  WAITING: 'WAITING',
  CREATING_CIRCLE: 'CREATING_CIRCLE',
  CREATING_SUBCIRCLE: 'CREATING_SUBCIRCLE'
})

const CIRCLE = {
  name: '',
  description: ''
}

const SUB_CIRCLE = {
  circle: '',
  name: '',
  description: ''
}

const CIRCLE_QUERY = `
  queryCircle(
    filter: { 
      details_dao_i: { eq: $daoId }, 
      details_autoApprove_i: { eq: 1 } 
      not: { has: parentcircle }
    }
  ) {
    id: docId
    name: details_title_s
    purpose: details_description_s

    memberAggregate {
      count
    }

    subcircles: subcircle {
      id: docId
      name: details_title_s
      purpose: details_description_s
    }
  }
`

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
      query: gql`query CIRCLES($daoId: Int64!) { ${CIRCLE_QUERY} }`,
      update: data => data.queryCircle,
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      subscribeToMore: {
        document: gql`subscription CIRCLES($daoId: Int64!) { ${CIRCLE_QUERY} }`,
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

      circle: { ...CIRCLE },
      subcricle: { ...SUB_CIRCLE }
    }
  },

  methods: {
    ...mapActions('dao', ['createCircle', 'deleteCircle']),

    async _createCircle (data) {
      try {
        await this.createCircle({ data })
        this.cirlce = { ...CIRCLE }
        this.subcricle = { ...SUB_CIRCLE }
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

    circleCount () { return this.circles ? this.circles?.length : 0 },
    hasCircles () { return this.circles && this?.circles.length > 0 }
  }

}
</script>

<template lang="pug">
widget(:title="$t('configuration.settings-structure.circles.title')" titleImage='/svg/chart-network.svg' bar).q-pa-none.full-width.q-mt-sm
  p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-structure.circles.description') }}
  .hr.q-my-xl

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
      template(v-for="(circle, index) in circles")
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
            p.q-pa-none.text-sm.text-h-gray.leading-loose {{ circle.purpose }}
            template(v-for="(subcricle, index) in circle.subcircles")
              article.col-12.q-mb-md
                widget.q-pa-xl( bar shadow no-padding)
                  .row
                    .col
                      .text-xl.text-bold.text-primary {{ subcricle.name }}
                      p.q-pa-none.q-ma-none.text-sm.text-h-gray.leading-loose {{ subcricle.purpose }}

                    .col-auto.q-pt-xxs
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
                            q-item(@click="_deleteCircle(subcricle.id)" clickable v-close-popup)
                              q-item-section {{ $t('actions.delete') }}

            .hr.q-my-xl
            section(v-if="state === STATES.CREATING_SUBCIRCLE[index]")
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
                  v-model='subcricle.name'
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
                  v-model='subcricle.description'
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
                  @click="_createCircle({ ...subcricle, circle: circle.id})"
                  color="secondary"
                  no-caps
                  rounded
                  unelevated
                )
            footer.row.q-mt-md(v-else)
              .row.col.items-center
                q-avatar.q-mr-sm.bg-h-gray(size="md" text-color="white" icon="fas fa-user")
                p.q-pa-none.q-ma-none.text-sm.text-primary.text-bold.leading-loose {{ circle?.memberAggregate?.count }}  {{ $t('dao.member') }}
              .col-auto
                q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-ml-xs(
                  :label="$t('configuration.settings-structure.circles.nav.create-subcircle')"
                  @click="state = STATES.CREATING_SUBCIRCLE[index]"
                  color="primary"
                  no-caps
                  rounded
                  unelevated
                  outline
              )

    section(v-if="state === STATES.CREATING_CIRCLE")
      .hr.q-my-xl(v-if="hasCircles")

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
          @click="_createCircle({...circle})"
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
