<script>
import CONFIG from './config/config.json'
export default {
  name: 'templates-modal',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  data () {
    return {
      CONFIG,
      currentStepIndex: 0,
      setupState: false,
      successful: false,
      processPercentage: 20,
      selectedOption: null,
      currentProposal: null
    }
  },
  props: {
    activated: Boolean
  },

  methods: {
    back () {
      switch (this.currentStepIndex) {
        case 1:
          this.currentStepIndex = 0
          break
        case 2:
          this.currentStepIndex = 1
          break
        case 3:
          this.currentStepIndex = 2
      }
    }
  },

  computed: {
    modalTitle () {
      if (this.setupState) {
        return 'Set up your DAO'
      } else {
        return 'Customize your DAO'
      }
    },
    breadcrumbs () {
      switch (this.currentStepIndex) {
        case 1:
          return ' | Use a template'
        case 2:
          return ' | Use a template | Template Details'
        case 3:
          return ` | Use a template | Template Details | ${this.currentProposal.title}`
      }
      return ''
    }
  }
}
</script>

<template lang="pug">
.templates-modal
  q-dialog(:value="activated" full-width)
    widget.relative(:style="{ 'max-width': '1180px !important', 'height': '640px' }" :title="modalTitle" breadcrumbs)
      template(v-slot:header)
        .breadcrumbs.font-lato.relative(v-if="currentStepIndex !== 0" :style="{ 'font-size': '18px', 'margin-top': '4px', 'margin-left': '4px' }") {{ breadcrumbs }}
      q-icon.absolute(v-if="currentStepIndex !== 0 && !setupState" @click="back()" name="fas fa-arrow-left" color="primary" :style="{ 'top': '10px', 'left': '-20px', 'cursor': 'pointer' }")
      .col.flex(v-if="setupState" :style="{ 'margin-top': '160px' }" @click="successful = true, processPercentage = 100")
        .row
          .col-8.flex.items-center
            .col
              .h-h3.q-mb-md
                template(v-if="successful") All Templates proposals have been successfully published and are now ready for uther DAO members to vote!
                template(v-else) Creating and publishing all the template proposals. This process might take a minute, please don’t leave this page
              .h-b2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              .col.q-mt-xxl
                .row.h-h6
                  div Publishing process:
                  div.q-ml-xxs(:class="{ 'text-positive': successful }") {{ processPercentage }}%
                q-linear-progress.q-mt-sm(:value="processPercentage/100" :color="successful ? 'positive' : 'primary'" rounded)
          .col.justify-center.flex
            div.flex.items-center.justify-center(v-if="successful" :style="{ 'width': '205px', 'height': '205px', 'background': '#1CB59B', 'border-radius': '50%' }")
              q-icon(name="fa fa-check" color="white" size="110px")
            div.flex.items-center.justify-center(v-else :style="{ 'width': '205px', 'height': '205px', 'background': '#242F5D', 'border-radius': '50%' }")
              q-icon(name="fa fa-caret-up" color="white" size="150px")
      .q-pt-xl(v-else)
        template(v-if="currentStepIndex === 0")
          .row.q-gutter-xl
            .col
              q-card.card
                img(:style="{ 'max-height': '230px' }" src="~/assets/images/template-option-img.png")
                q-card-section.q-px-xl.q-pt-xl
                  .h-h4 Use a Template
                q-card-section.q-px-xl.q-pt-none.q-pb-xxl
                  .h-b2 A DAO template is a pre-packaged set of proposals, each containing a particular organisational item (like a Role Archetype, for example). Once you select a template, all the items contained in it will generate a single proposal. Each of this proposals will be then up for voting in the proposals screen, so that other DAO members will agree with all the bit and pieces of the DAO template configuration.
                q-card-section.q-px-xl.justify-end.flex.q-pb-xxl.q-pt-none
                  .col
                  .col
                    q-btn.relative.q-px-lg.h-btn1.full-width(
                      color="primary"
                      label="Use a Template"
                      no-caps
                      rounded
                      unelevated
                      @click="currentStepIndex = 1"
                    )
                      q-icon.absolute(name="fas fa-plus" size="10px" :style="{ 'margin-top': '2px', 'right': '12px' }")
            .col
              q-card.card
                img(:style="{ 'max-height': '230px' }" src="~/assets/images/scratch-option-img.png")
                q-card-section.q-px-xl.q-pt-xl
                  .h-h4 Start from Scratch
                q-card-section.q-px-xl.q-pt-none.q-pb-xxl
                  .h-b2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                q-card-section.q-px-xl.justify-end.flex.q-pb-xxl.q-pt-none
                  .col
                  .col
                    q-btn.q-px-lg.h-btn1.relative.full-width(
                      :style="{ 'bottom': '-39px' }"
                      color="primary"
                      label="Start from scratch"
                      no-caps
                      rounded
                      unelevated
                      @click="activated = false"
                    )
                      q-icon.absolute(name="fas fa-plus" size="10px" :style="{ 'margin-top': '2px', 'right': '12px' }")
        template(v-if="currentStepIndex === 1")
          .row.q-gutter-xl
            template(v-for="option in CONFIG.templates")
              .col
                q-card.card.q-pa-sm.flex(:style="{ 'flex-direction': 'column' }")
                  .col
                    q-card-section
                      .h-h5 {{ option.title }}
                    q-card-section.q-py-none
                      .h-b2 {{ option.description }}
                    q-card-section.q-pt-none
                      ul.q-pl-sm
                        template(v-for="li in option.possibilities")
                          li.text-bold.text-black {{ li }}
                  .col.flex.justify-end(:style="{ 'flex-direction': 'column' }")
                    q-card-section.relative(:style="{ 'bottom': '0' }")
                      .row.q-gutter-md
                        .col
                          q-btn.q-px-lg.h-btn1.relative.full-width.text-no-wrap(
                            color="primary"
                            label="See details"
                            no-caps
                            rounded
                            unelevated
                            outline
                            @click="currentStepIndex = 2, selectedOption = option"
                          )
                        .col
                          q-btn.q-px-lg.h-btn1.relative.full-width(
                            color="primary"
                            label="Select"
                            no-caps
                            rounded
                            unelevated
                            @click="setupState = true"
                          )
        template(v-if="currentStepIndex === 2")
          .h-h4 {{ selectedOption.title }}
          .font-lato.text-black.q-mt-md(:style="{ 'font-size': '18px' }") {{ selectedOption.description }}
          .row.q-mt-md
            .row.h-h4.q-mb-md Role Archetypes ({{ selectedOption.details.roleArchetypes.length }})
            .row.q-col-gutter-xl
              .col-4(v-for="archetype in selectedOption.details.roleArchetypes")
                widget.details-card
                  .h-h5 {{ archetype.title }}
                  .h-b2.q-mt-md {{ archetype.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = archetype, currentStepIndex = 3") More Details
          .row.q-mt-md
            .row.h-h4.q-mb-md Circles ({{ selectedOption.details.circles.length }})
            .row.q-col-gutter-xl
              .col-4(v-for="circle in selectedOption.details.circles")
                widget.details-card
                  .h-h5 {{ circle.title }}
                  .h-b2.q-mt-md {{ circle.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = circle, currentStepIndex = 3") More Details
          .row.q-mt-md
            .row.h-h4.q-mb-md DAO Policies ({{ selectedOption.details.circles.length }})
            .row.q-col-gutter-xl
              .col-4(v-for="policy in selectedOption.details.policies")
                widget.details-card
                  .h-h5 {{ policy.title }}
                  .h-b2.q-mt-md {{ policy.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = policy, currentStepIndex = 3") More Details
          .col.q-mt-md
            .row.h-h4.q-mb-md Core team Voting method
            .row.q-col-gutter-xl
              .col-4(v-for="method in selectedOption.details.coreVotingMethod")
                widget.details-card
                  .h-h5 {{ method.title }}
                  .h-b2.q-mt-md {{ method.description }}
                  .row.q-mt-sm
                    .col.flex.justify-between
                      .row.items-center
                        q-icon.q-mr-xxs(name="fas fa-vote-yea" color="black")
                        .h-b2.text-bold.text-black Unity
                      .h-b2.text-bold.text-black {{ method.unity }}%
                      q-linear-progress.q-mt-xxs(:value="method.unity/100" :color="'primary'" rounded)
                  .row.q-mt-md
                    .col.flex.justify-between
                      .row.items-center
                        q-icon.q-mr-xxs(name="fas fa-users" color="black")
                        .h-b2.text-bold.text-black Quorum
                      .h-b2.text-bold.text-black {{ method.quorum }}%
                      q-linear-progress.q-mt-xxs(:value="method.quorum/100" :color="'primary'" rounded)
          .col.q-mt-md
            .row.h-h4.q-mb-md Community team Voting method
            .row.q-col-gutter-xl
              .col-4(v-for="method in selectedOption.details.communityVotingMethod")
                widget.details-card
                  .h-h5 {{ method.title }}
                  .h-b2.q-mt-md {{ method.description }}
                  .row.q-mt-sm
                    .col.flex.justify-between
                      .row.items-center
                        q-icon.q-mr-xxs(name="fas fa-vote-yea" color="black")
                        .h-b2.text-bold.text-black Unity
                      .h-b2.text-bold.text-black {{ method.unity }}%
                      q-linear-progress.q-mt-xxs(:value="method.unity/100" :color="'primary'" rounded)
                  .row.q-mt-md
                    .col.flex.justify-between
                      .row.items-center
                        q-icon.q-mr-xxs(name="fas fa-users" color="black")
                        .h-b2.text-bold.text-black Quorum
                      .h-b2.text-bold.text-black {{ method.quorum }}%
                      q-linear-progress.q-mt-xxs(:value="method.quorum/100" :color="'primary'" rounded)
          .row.q-mt-md
            .row.h-h4.q-mb-md Core team badges ({{ selectedOption.details.coreBadges.length }})
            .row.q-col-gutter-xl
              .col-4(v-for="badge in selectedOption.details.coreBadges")
                widget.details-card
                  .icon.q-mb-xs
                    q-icon(name="fas fa-cog" color="white")
                  .h-h5 {{ badge.title }}
                  .h-b2.q-mt-md {{ badge.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = badge, currentStepIndex = 3") More Details
          .row.q-mt-md.q-pb-xl
            .row.h-h4.q-mb-md Community team badges ({{ selectedOption.details.communityBadges.length }})
            .row.q-col-gutter-xl
              .col-4(v-for="badge in selectedOption.details.communityBadges")
                widget.details-card
                  .icon.q-mb-xs.bg-secondary
                    q-icon(name="fas fa-cog" color="white")
                  .h-h5 {{ badge.title }}
                  .h-b2.q-mt-md {{ badge.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = badge, currentStepIndex = 3") More Details
        template(v-if="currentStepIndex === 3")
          widget(:style="{ 'box-shadow': '0px 0px 30px #0000001F !important', 'border-radius': '25px' }")
            .text-grey.text-italic(:style="{ 'font-size': '12px' }") Title
            .h-h3 {{ currentProposal.title }}
            .text-grey.text-italic.q-mt-md(:style="{ 'font-size': '12px' }") Description
            .h-b4(:style="{ 'font-size': '18px' }") {{ currentProposal.description }}
        .row.full-width.justify-end.q-pb-md(v-if="currentStepIndex === 2")
          q-btn.q-px-lg.h-btn1.relative(
            color="primary"
            label="Back to templates"
            no-caps
            rounded
            unelevated
            outline
            @click="currentStepIndex = 1"
          )
          q-btn.q-ml-md.q-px-lg.h-btn1.relative(
            color="primary"
            label="Select this template"
            no-caps
            rounded
            unelevated
            @click="setupState = true"
          )
      .row.absolute(:style="{ 'bottom': '0', 'right': '0' }")
        q-btn.q-px-lg.h-btn1.relative(
          v-if="successful"
          color="primary"
          label="Go to proposals dashboard"
          no-caps
          rounded
          unelevated
          outline
        )
        q-btn.q-ml-md.q-px-lg.h-btn1.relative(
          v-if="successful"
          color="primary"
          label="Go to organization Dashboard"
          no-caps
          rounded
          unelevated
        )
</template>

<styles lang="stylus" scoped>
.card
  height: 100%
  min-height: 517px
  box-shadow: 0px 0px 30px #0000001F
  border-radius: 25px
.details-card
  box-shadow: 0px 0px 30px #0000001F !important
  border-radius: 25px !important
.icon
  width: 30px
  height: 30px
  background: #242f5d
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
</styles>
