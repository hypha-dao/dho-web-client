<script>
import { mapActions, mapGetters } from 'vuex'
import gql from 'graphql-tag'

const STATES = Object.freeze({
  WAITING: 'WAITING',
  CREATING_ROLE: 'CREATING_ROLE',
  SAVING_ROLE: 'SAVING_ROLE',
  CREATING_LEVEL: 'CREATING_LEVEL',
  SAVING_LEVEL: 'SAVING_LEVEL'
})

const TABS = Object.freeze({
  TYPE: 'TYPE',
  LEVEL: 'LEVEL'
})

const LEVEL = {
  name: '',
  annualAmount: '',
  minDeferred: 10
}

const ROLE = {
  name: '',
  description: ''
}

export default {
  name: 'widget-roles',
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
    // levels: {
    //   query: gql`
    //     query LEVELS($daoId: Int64!) {
    //       querySalaryband(
    //         filter: {
    //           details_dao_i: { eq: $daoId },
    //         }
    //       ) {
    //         id: docId
    //         name: details_name_s
    //         annualAmount: details_annualUsdSalary_a
    //         minDeferred: details_minDeferredX100_i
    //       }
    //     }`,
    //   update: data => data.queryRole,
    //   skip () { return !this.selectedDao?.docId },
    //   variables () { return { daoId: this.selectedDao.docId } },
    //   subscribeToMore: {
    //     document: gql`
    //       subscription LEVELS($daoId: Int64!) {
    //         querySalaryband(
    //           filter: {
    //             details_dao_i: { eq: $daoId },
    //           }
    //         ) {
    //           id: docId
    //           name: details_name_s
    //           annualAmount: details_annualUsdSalary_a
    //           minDeferred: details_minDeferredX100_i
    //         }
    //       }`,

    //     skip () { return !this.selectedDao?.docId },
    //     variables () { return { daoId: this.selectedDao.docId } },
    //     updateQuery: (previousResult, { subscriptionData }) => {
    //       if (!subscriptionData.data) {
    //         return previousResult
    //       }
    //       if (!previousResult) {
    //         return undefined
    //       }

    //       return subscriptionData.data
    //     }
    //   }
    // }

    roles: {
      query: gql`
        query ROLES($daoId: Int64!) {
          queryRole(
            filter: { 
              details_dao_i: { eq: $daoId }, 
              details_autoApprove_i: { eq: 1 } 
            }
          ) {
            id: docId
            name: details_title_s
            description: details_description_s
          }
        }`,
      update: data => data.queryRole,
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      subscribeToMore: {
        document: gql`
          subscription ROLES($daoId: Int64!) {
              queryRole(
                filter: { 
                  details_dao_i: { eq: $daoId }, 
                  details_autoApprove_i: { eq: 1 } 
                }
              ) {
                id: docId
                name: details_title_s
                description: details_description_s
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
      TABS,

      state: STATES.WAITING,
      tab: TABS.TYPE,

      level: { ...LEVEL },
      role: { ...ROLE }
    }
  },

  methods: {
    ...mapActions('dao', ['createLevel', 'deleteLevel', 'createRole', 'deleteRole']),

    async _createLevel () {
      try {
        await this.createLevel({ data: [{ ...this.level }] })
        this.level = { ...LEVEL }
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }

      this.state = STATES.WAITING
    },

    async _deleteLevel (level) {
      try {
        await this.deleteLevel({ data: [{ ...level }] })
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }

      this.state = STATES.WAITING
    },

    async _createRole () {
      try {
        await this.createRole({ data: { ...this.role } })
        this.role = { ...ROLE }
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }

      this.state = STATES.WAITING
    },

    async _deleteRole (id) {
      try {
        await this.deleteRole(id)
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }

      this.state = STATES.WAITING
    },

    formatCurrency (amount) { return amount ? new Intl.NumberFormat().format(parseInt(amount), { style: 'currency' }) : 0 }

  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),

    hasLevels () { return this.form && this.form.levels && this?.form?.levels.length > 0 },
    hasRoles () { return this?.roles && this?.roles.length > 0 },
    levelCount () { return this.form && this.form.levels && this?.form?.levels.length },
    roleCount () { return this.roles ? this.roles?.length : 0 }
  },

  watch: {
    tab () {
      // Everytime tab changes, reset state to WAITING
      this.state = STATES.WAITING
    }
  }

}
</script>

<template lang="pug">
widget(title='Roles' titleImage='/svg/briefcase.svg' bar).q-pa-none.full-width
  p.text-sm.text-h-gray.leading-loose.q-mt-md Here you can set up your DAO's roles. These are a set of basic accountabilities that a user role can fulfill. You can think of them as templated job descriptions.

  q-tabs(
    active-color="primary"
    align="center"
    indicator-color="primary"
    no-caps
    v-model="tab"
  )
    q-tab(:name="TABS.TYPE" label="Types" :ripple="false")
    q-tab(:name="TABS.LEVEL" label="Levels" :ripple="false")

  section(v-if="tab === TABS.TYPE").q-mt-md
    header.column.justify-center.text-center.items-center(v-if="!hasRoles && state !== STATES.WAITING")
      p.text-sm.text-h-gray.leading-loose.q-mt-md Here you can create new role types by adding a name and set of accountabilities.
      q-btn.q-px-xl.text-bold(
        @click="state = STATES.CREATING_ROLE"
        color="primary"
        icon="fas fa-plus"
        label="Create new role"
        no-caps
        rounded
        unelevated
        v-if="isAdmin"
      )

    section(v-if="hasRoles").row.q-col-gutter-md
      template(v-for="role in roles")
        article(:class="['col-'+ Math.min(Math.max(Math.floor(12/roleCount), 3), 12)]")
          widget(:title="role?.name" shadow bar)
            template(v-slot:header)
              q-btn.q-pa-xs.relative-position(
                color="primary"
                dense
                flat
                icon="fas fa-ellipsis-v"
                round
                size="sm"
                v-if="isAdmin"
              )
                q-menu
                  q-list(dense)
                    q-item(@click="_deleteRole(role.id)" clickable v-close-popup)
                      q-item-section Delete

            p.q-pa-none.text-sm.text-h-gray.leading-loose.q-mt-md {{ role?.description }}

    section(v-if="state === STATES.CREATING_ROLE")
      .hr.q-my-md(v-if="hasLevels")

      .full-width
          label.h-label Role Name
          q-input.q-my-xs(
            :debounce="200"
            :disable="!isAdmin"
            bg-color="white"
            color="accent"
            dense
            lazy-rules
            outlined
            placeholder="Type a role name"
            ref="name"
            rounded
            v-model='role.name'
          )
      .full-width.q-mt-md
          label.h-label Role Description
          q-input.q-my-xs(
            :debounce="200"
            :disable="!isAdmin"
            :input-style="{ 'resize': 'none' }"
            bg-color="white"
            color="accent"
            dense
            lazy-rules
            maxlength="300"
            outlined
            placeholder="Type a role description"
            ref="nickname"
            rounded
            rows="3"
            type="textarea"
            v-model='role.description'
          )

      nav.full-width.q-my-xl.row.justify-end
          q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-mr-xs(
            @click="state = STATES.WAITING"
            color="white"
            label="Cancel"
            no-caps
            rounded
            text-color="primary"
            unelevated
          )
          q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-ml-xs(
            @click="_createRole"
            color="secondary"
            label="Done"
            no-caps
            rounded
            unelevated
          )

    nav.full-width.row.justify-end.q-mt-xl(v-if="hasRoles && state === STATES.WAITING")
      q-btn.q-px-xl.text-bold(
        @click="state = STATES.CREATING_ROLE"
        color="primary"
        icon="fas fa-plus"
        label="Create new role"
        no-caps
        rounded
        unelevated
        v-if="isAdmin"
      )

  section(v-if="tab === TABS.LEVEL").q-mt-md
    header.column.justify-center.text-center.items-center(v-if="!hasLevels && state !== STATES.WAITING")
      p.text-sm.text-h-gray.leading-loose.q-mt-md Add what level the role is at with regard to complexity or commercial contribution.
      q-btn.q-px-xl.text-bold(
        @click="state = STATES.CREATING_LEVEL"
        color="primary"
        icon="fas fa-plus"
        label="Create new level"
        no-caps
        rounded
        unelevated
        v-if="isAdmin"
      )

    section(v-if="hasLevels").row.q-col-gutter-md
      template(v-for="level in form.levels")
        article(:class="['col-'+ Math.min(Math.max((12/levelCount), 3), 12)]")
          widget(:title="level.name" shadow bar)
            template(v-slot:header)
              q-btn.q-pa-xs.relative-position(
                color="primary"
                dense
                flat
                icon="fas fa-ellipsis-v"
                round
                size="sm"
                v-if="isAdmin"
              )
                q-menu
                  q-list(dense)
                    q-item(@click="_deleteLevel(level)" clickable v-close-popup)
                      q-item-section Delete

            p.q-pa-none.text-sm.text-h-gray.leading-loose.q-mt-xs ${{ formatCurrency(level.annualAmount) }}/year

    section(v-if="state === STATES.CREATING_LEVEL")
      .hr.q-my-md(v-if="hasLevels")

      .row.q-col-gutter-md.q-mt-xl
        .col-3
          label.h-label Level name
          q-input.q-my-xs(
              :debounce="200"
              :disable="!isAdmin"
              bg-color="white"
              color="accent"
              dense
              lazy-rules
              outlined
              placeholder="Type a level name"
              ref="name"
              rounded
              v-model='level.name'
          )

        .col-3
          label.h-label Yearly reward
          q-input.q-my-xs(
              :debounce="200"
              :disable="!isAdmin"
              bg-color="white"
              color="accent"
              dense
              lazy-rules
              outlined
              placeholder="Type an amount"
              ref="annualAmount"
              rounded
              type='number'
              v-model='level.annualAmount'
          )
            template(v-slot:before)
              q-icon(name="fas fa-dollar-sign")

        .col-3
          label.h-label Montly reward
          q-input.q-my-xs(
              :debounce="200"
              :disable="true"
              bg-color="white"
              color="accent"
              dense
              lazy-rules
              outlined
              ref="name"
              rounded
              type='number'
              :value='parseFloat(level.annualAmount / 12).toFixed(2)'
          )
            template(v-slot:before)
              q-icon(name="fas fa-dollar-sign")

        .col-3
          label.h-label Min Deferred
          .row.full-width.items-center
            .col.row.q-mr-sm
              q-slider(
                :max="100"
                :min="0"
                :step="1"
                color="primary"
                v-model="level.minDeferred"
              )
            .col-3
              q-input.rounded-border.q-py-sm(
                :rules="[val => val >= 0 && val <= 100]"
                dense
                outlined
                rounded
                suffix="%"
                v-model.number="level.minDeferred"
              )

      nav.full-width.q-my-xl.row.justify-end
          q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-mr-xs(
              @click="state = STATES.WAITING"
              color="white"
              label="Cancel"
              no-caps
              rounded
              text-color="primary"
              unelevated
          )
          q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-ml-xs(
              @click="_createLevel"
              color="secondary"
              label="Done"
              no-caps
              rounded
              unelevated
          )

    nav.full-width.row.justify-end.q-mt-xl(v-if="hasLevels && state === STATES.WAITING")
      q-btn.q-px-xl.text-bold(
        @click="state = STATES.CREATING_LEVEL"
        color="primary"
        icon="fas fa-plus"
        label="Create new level"
        no-caps
        rounded
        unelevated
        v-if="isAdmin"
      )

</template>

<style lang="stylus" scoped>
</style>
