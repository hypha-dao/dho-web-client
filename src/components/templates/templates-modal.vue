<script>
import CONFIG from './config/config.json'

export default {
  name: 'templates-modal',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  props: {
    isOpen: Boolean
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
  q-dialog(:value="isOpen" full-width="full-width")
    widget.relative.wrapper(:style="{'width': '300px'}" :title="$t('templates.templates-modal.customizeYourDao')" breadcrumbs="breadcrumbs")
      template(v-slot:header)
        .breadcrumbs.font-lato.relative(v-if="currentStepIndex !== 0" :style="{ 'font-size': '18px', 'margin-top': '4px', 'margin-left': '4px' }") {{ breadcrumbs }}
      q-icon.absolute(v-if="currentStepIndex !== 0 && !setupState" @click="back()" name="fas fa-arrow-left" color="primary" :style="{ 'top': '10px', 'left': '-20px', 'cursor': 'pointer' }")
      .col.flex(v-if="setupState" :style="{ 'margin-top': '160px' }" @click="successful = true, processPercentage = 100")
        .row
          .col-8.flex.items-center
            .col
              .h-h3.q-mb-md
                template(v-if="successful") {{ $t('templates.templates-modal.allTemplatesProposals') }}
                template(v-else) {{ $t('templates.templates-modal.creatingAndPublishing') }}
              .h-b2 {{ $t('templates.templates-modal.loremIpsumDolor') }}
              .col.q-mt-xxl
                .row.h-h6
                  div {{ $t('templates.templates-modal.publishingProcess') }}
                  .q-ml-xxs(:class="{ 'text-positive': successful }") {{ processPercentage }}
                    | %
                q-linear-progress.q-mt-sm(:value="processPercentage/100" :color="successful ? 'positive' : 'primary'" rounded="rounded")
          .col.justify-center.flex
            .flex.items-center.justify-center(v-if="successful" :style="{ 'width': '205px', 'height': '205px', 'background': '#1CB59B', 'border-radius': '50%' }")
              q-icon(name="fa fa-check" color="white" size="110px")
            .flex.items-center.justify-center(v-else :style="{ 'width': '205px', 'height': '205px', 'background': '#242F5D', 'border-radius': '50%' }")
              q-icon(name="fa fa-caret-up" color="white" size="150px")
      .q-pt-xl(v-else)
        template(v-if="currentStepIndex === 0")
          .row.q-gutter-xl
            .col
              q-card.card.row.justify-between
                img(:style="{ 'max-height': '230px' }" src="~/assets/images/template-option-img.png")
                q-card-section.full-width.q-px-xl.q-pt-xl
                  .h-h4 {{ $t('templates.templates-modal.chooseADaoTemplate') }}
                  p.q-py-sm.text-sm.text-h-gray.leading-loose {{ $t('templates.templates-modal.aDaoTemplate') }}
                q-card-section.full-width.q-px-xl.justify-end.flex
                  .col
                  .col
                    q-btn.relative.q-px-lg.h-btn1.full-width(@click="currentStepIndex = 1" color="primary" :label="$t('templates.templates-modal.useATemplate')" no-caps="no-caps" rounded="rounded" unelevated="unelevated")
                      q-icon.absolute(name="fas fa-plus" size="10px" :style="{ 'margin-top': '2px', 'right': '12px' }")
            .col
              q-card.card.row.justify-between
                img(:style="{ 'max-height': '230px' }" src="~/assets/images/scratch-option-img.png")
                q-card-section.full-width.q-px-xl.q-pt-xl
                  .h-h4 {{ $t('templates.templates-modal.startFromScratch') }}
                  p.q-py-sm.text-sm.text-h-gray.leading-loose {{ $t('templates.templates-modal.youCanChoose') }}
                q-card-section.full-width.q-px-xl.justify-end.flex
                  .col
                  .col
                    q-btn.relative.q-px-lg.h-btn1.full-width(@click="isOpen = false" color="primary" :label="$t('templates.templates-modal.createYourOwn')" no-caps="no-caps" rounded="rounded" unelevated="unelevated")
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
                          q-btn.q-px-lg.h-btn1.relative.full-width.text-no-wrap(color="primary" :label="$t('templates.templates-modal.seeDetails')" no-caps="no-caps" rounded="rounded" unelevated="unelevated" outline="outline" @click="currentStepIndex = 2, selectedOption = option")
                        .col
                          q-btn.q-px-lg.h-btn1.relative.full-width(color="primary" :label="$t('templates.templates-modal.select')" no-caps="no-caps" rounded="rounded" unelevated="unelevated" @click="$emit('submit' ,option)")
        template(v-if="currentStepIndex === 2")
          .h-h4 {{ selectedOption.title }}
          .font-lato.text-black.q-mt-md(:style="{ 'font-size': '18px' }") {{ selectedOption.description }}
          .row.q-mt-md
            .row.h-h4.q-mb-md {{ $t('templates.templates-modal.roleArchetypes', { '1': selectedOption.details.archetypes.length }) }}
            .row.q-col-gutter-xl
              .col-4(v-for="archetype in selectedOption.details.archetypes")
                widget.details-card
                  .h-h5 {{ archetype.title }}
                  .h-b2.q-mt-md {{ archetype.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = archetype, currentStepIndex = 3") {{ $t('templates.templates-modal.moreDetails') }}
          .row.q-mt-md
            .row.h-h4.q-mb-md {{ $t('templates.templates-modal.circles', { '1': selectedOption.details.circles.length }) }}
            .row.q-col-gutter-xl
              .col-4(v-for="circle in selectedOption.details.circles")
                widget.details-card
                  .h-h5 {{ circle.title }}
                  .h-b2.q-mt-md {{ circle.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = circle, currentStepIndex = 3") {{ $t('templates.templates-modal.moreDetails1') }}
          .row.q-mt-md
            .row.h-h4.q-mb-md {{ $t('templates.templates-modal.daoPolicies', { '1': selectedOption.details.circles.length }) }}
            .row.q-col-gutter-xl
              .col-4(v-for="policy in selectedOption.details.policies")
                widget.details-card
                  .h-h5 {{ policy.title }}
                  .h-b2.q-mt-md {{ policy.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = policy, currentStepIndex = 3") {{ $t('templates.templates-modal.moreDetails2') }}
          .col.q-mt-md
            .row.h-h4.q-mb-md {{ $t('templates.templates-modal.coreTeamVotingMethod') }}
            .row.q-col-gutter-xl
              .col-4(v-for="method in selectedOption.details.coreVotingMethod")
                widget.details-card
                  .h-h5 {{ method.title }}
                  .h-b2.q-mt-md {{ method.description }}
                  .row.q-mt-sm
                    .col.flex.justify-between
                      .row.items-center
                        q-icon.q-mr-xxs(name="fas fa-vote-yea" color="black")
                        .h-b2.text-bold.text-black {{ $t('templates.templates-modal.unity') }}
                      .h-b2.text-bold.text-black {{ method.unity }}
                        | %
                      q-linear-progress.q-mt-xxs(:value="method.unity/100" :color="'primary'" rounded="rounded")
                  .row.q-mt-md
                    .col.flex.justify-between
                      .row.items-center
                        q-icon.q-mr-xxs(name="fas fa-users" color="black")
                        .h-b2.text-bold.text-black {{ $t('templates.templates-modal.quorum') }}
                      .h-b2.text-bold.text-black {{ method.quorum }}
                        | %
                      q-linear-progress.q-mt-xxs(:value="method.quorum/100" :color="'primary'" rounded="rounded")
          .col.q-mt-md
            .row.h-h4.q-mb-md {{ $t('templates.templates-modal.communityTeamVotingMethod') }}
            .row.q-col-gutter-xl
              .col-4(v-for="method in selectedOption.details.communityVotingMethod")
                widget.details-card
                  .h-h5 {{ method.title }}
                  .h-b2.q-mt-md {{ method.description }}
                  .row.q-mt-sm
                    .col.flex.justify-between
                      .row.items-center
                        q-icon.q-mr-xxs(name="fas fa-vote-yea" color="black")
                        .h-b2.text-bold.text-black {{ $t('templates.templates-modal.unity1') }}
                      .h-b2.text-bold.text-black {{ method.unity }}
                        | %
                      q-linear-progress.q-mt-xxs(:value="method.unity/100" :color="'primary'" rounded="rounded")
                  .row.q-mt-md
                    .col.flex.justify-between
                      .row.items-center
                        q-icon.q-mr-xxs(name="fas fa-users" color="black")
                        .h-b2.text-bold.text-black {{ $t('templates.templates-modal.quorum1') }}
                      .h-b2.text-bold.text-black {{ method.quorum }}
                        | %
                      q-linear-progress.q-mt-xxs(:value="method.quorum/100" :color="'primary'" rounded="rounded")
          .row.q-mt-md
            .row.h-h4.q-mb-md {{ $t('templates.templates-modal.coreTeamBadges', { '1': selectedOption.details.coreBadges.length }) }}
            .row.q-col-gutter-xl
              .col-4(v-for="badge in selectedOption.details.coreBadges")
                widget.details-card
                  .icon.q-mb-xs
                    q-icon(name="fas fa-cog" color="white")
                  .h-h5 {{ badge.title }}
                  .h-b2.q-mt-md {{ badge.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = badge, currentStepIndex = 3") {{ $t('templates.templates-modal.moreDetails3') }}
          .row.q-mt-md.q-pb-xl
            .row.h-h4.q-mb-md {{ $t('templates.templates-modal.communityTeamBadges', { '1': selectedOption.details.communityBadges.length }) }}
            .row.q-col-gutter-xl
              .col-4(v-for="badge in selectedOption.details.communityBadges")
                widget.details-card
                  .icon.q-mb-xs.bg-secondary
                    q-icon(name="fas fa-cog" color="white")
                  .h-h5 {{ badge.title }}
                  .h-b2.q-mt-md {{ badge.description }}
                  .h-b2.text-primary.text-underline.q-mt-md.text-bold.cursor-pointer(@click="currentProposal = badge, currentStepIndex = 3") {{ $t('templates.templates-modal.moreDetails4') }}
        template(v-if="currentStepIndex === 3")
          widget(:style="{ 'box-shadow': '0px 0px 30px #0000001F !important', 'border-radius': '25px' }")
            .text-grey.text-italic(:style="{ 'font-size': '12px' }") {{ $t('templates.templates-modal.title') }}
            .h-h3 {{ currentProposal.title }}
            .text-grey.text-italic.q-mt-md(:style="{ 'font-size': '12px' }") {{ $t('templates.templates-modal.description') }}
            .h-b4(:style="{ 'font-size': '18px' }") {{ currentProposal.description }}
        .row.full-width.justify-end.q-pb-md(v-if="currentStepIndex === 2")
          q-btn.q-px-lg.h-btn1.relative(color="primary" :label="$t('templates.templates-modal.backToTemplates')" no-caps="no-caps" rounded="rounded" unelevated="unelevated" outline="outline" @click="currentStepIndex = 1")
          q-btn.q-ml-md.q-px-lg.h-btn1.relative(color="primary" :label="$t('templates.templates-modal.selectThisTemplate')" no-caps="no-caps" rounded="rounded" unelevated="unelevated" @click="$emit('submit' ,selectedOption)")
      .row.absolute(:style="{ 'bottom': '0', 'right': '0' }")
        q-btn.q-px-lg.h-btn1.relative(v-if="successful" color="primary" :label="$t('templates.templates-modal.goToProposalsDashboard')" no-caps="no-caps" rounded="rounded" unelevated="unelevated" outline="outline")
        q-btn.q-ml-md.q-px-lg.h-btn1.relative(v-if="successful" color="primary" :label="$t('templates.templates-modal.goToOrganizationDashboard')" no-caps="no-caps" rounded="rounded" unelevated="unelevated")

</template>

<styles lang="stylus" scoped>
.wrapper
  min-height: 70vh
.card
  height: 100%
  min-height: 600px
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
