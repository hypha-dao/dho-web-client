<script>
export default {
  name: 'dho-overview',
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    OrganizationBanner: () => import('~/components/dashboard/organization-banner.vue'),
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
.dho-overview
  .row.full-width.relative-position.q-mb-md
    q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xs.close-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="white"
    )
    organization-banner
  .row.full-width.q-my-md
    .col-12
      widget
        .row.items-center
          .col
            .text-h6 Treasury
          .col-3.q-px-sm
            .text-grey-7 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          .col-7
            .row
              .col-4.q-px-sm
                .row.full-width.items-center
                  .col
                    img.icon(src="~assets/icons/husd.svg")
                  .col-9
                    .row.items-center.justify-between.amount.q-px-sm
                      .text-grey-7 0.2M
                      .text-primary.text-bold HUSD
              .col-4.q-px-sm
                .row.full-width.items-center
                  .col
                    img.icon(src="~assets/icons/hypha.svg")
                  .col-9
                    .row.items-center.justify-between.amount.q-px-sm
                      .text-grey-7 2.9M
                      .text-primary.text-bold Hypha tokens
              .col-4.q-px-sm
                .row.full-width.items-center
                  .col
                    img.icon(src="~assets/icons/seeds.png")
                  .col-9
                    .row.items-center.justify-between.amount.q-px-sm
                      .text-grey-7 3.1B
                      .text-primary.text-bold Seeds
          .col.text-right
            q-btn(flat color="primary" no-caps rounded :to="{ name: 'treasury' }") See more
  .row.full-width.q-my-md
    .col-9.q-pr-sm
      .row.q-mb-sm
        .col.q-pr-sm
          q-btn.fit(no-caps rounded unelevated color="white" text-color="primary" :style="{ 'border-radius': '24px' }")
            .row.full-width.q-pa-lg
              .text-h3.text-bold 26
              .row.full-width.justify-between.items-end.q-mt-md
                .col-11
                  .text-bold.text-grey-6
                    .text-left Active
                    .text-left assignments
                .col
                  q-icon.q-pb-sm(name="fas fa-chevron-right" size="xs")
        .col.q-px-sm
          q-btn.fit(no-caps rounded unelevated color="white" text-color="primary" :style="{ 'border-radius': '24px' }")
            .row.full-width.q-pa-lg
              .text-h3.text-bold 15
              .row.full-width.justify-between.items-end.q-mt-md
                .text-bold.text-grey-6
                  .text-left Active
                  .text-left quests
                q-icon.q-pb-sm(name="fas fa-chevron-right" size="xs")
        .col.q-px-sm
          q-btn.fit(no-caps rounded unelevated color="white" text-color="primary" :style="{ 'border-radius': '24px' }")
            .row.full-width.q-pa-lg
              .text-h3.text-bold 32
              .row.full-width.justify-between.items-end.q-mt-md
                .text-bold.text-grey-6
                  .text-left Recent
                  .text-left payouts
                q-icon.q-pb-sm(name="fas fa-chevron-right" size="xs")
        .col.q-px-sm
          q-btn.fit(no-caps rounded unelevated color="white" text-color="primary" :style="{ 'border-radius': '24px' }")
            .row.full-width.q-pa-lg
              .text-h3.text-bold 18
              .row.full-width.justify-between.items-end.q-mt-md
                .text-bold.text-grey-6
                  .text-left Active
                  .text-left badges
                q-icon.q-pb-sm(name="fas fa-chevron-right" size="xs")
        .col.q-pl-sm
          q-btn.fit(no-caps rounded unelevated color="white" text-color="primary" :style="{ 'border-radius': '24px' }")
            .row.full-width.q-pa-lg
              .text-h3.text-bold 5
              .row.full-width.justify-between.items-end.q-mt-md
                .text-bold.text-grey-6
                  .text-left Recent
                  .text-left strategies
                q-icon.q-pb-sm(name="fas fa-chevron-right" size="xs")
      .row.q-my-md
        widget
          .row.items-center.justify-between.q-ma-md
            .text-h6 Circles
            q-btn(flat color="primary" rounded no-caps :to="{ name: 'circles' }") See more
          .row
            .col-4.q-pa-sm
              button-radio(title="Anchor" icon="fas fa-anchor" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
            .col-4.q-pa-sm
              button-radio(title="Communication" icon="far fa-paper-plane" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
            .col-4.q-pa-sm
              button-radio(title="Financial" icon="fas fa-chart-line" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
            .col-4.q-pa-sm
              button-radio(title="Movement Building" icon="fas fa-bullhorn" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
            .col-4.q-pa-sm
              button-radio(title="People" icon="fas fa-user-friends" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
            .col-4.q-pa-sm
              button-radio(title="Product" icon="fas fa-box-open" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
      .row.q-my-md
        widget.full-width
          .row.items-center.justify-between.q-ma-md
            .text-h6 Badges
            q-btn(flat color="primary" rounded no-caps :to="{ name: 'badges' }") See more
          .row.q-pa-sm
            button-radio(horizontal title="Lamp Lighter" icon="far fa-lightbulb" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
              .row.items-center.justify-end
                .row
                  q-avatar(size="sm")
                    img(src="avatar-placeholder.png")
                  q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
                    img(src="avatar-placeholder.png")
                  q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
                    img(src="avatar-placeholder.png")
                .text-subtitle2.text-italic.on-right and other 12
          .row.q-pa-sm
            button-radio(horizontal title="Moderator" icon="far fa-comments" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
              .row.items-center.justify-end
                .row
                  q-avatar(size="sm")
                    img(src="avatar-placeholder.png")
                  q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
                    img(src="avatar-placeholder.png")
                  q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
                    img(src="avatar-placeholder.png")
                .text-subtitle2.text-italic.on-right and other 12
          .row.q-pa-sm
            button-radio(horizontal title="Ambassador" icon="fas fa-award" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
              .row.items-center.justify-end
                .row
                  q-avatar(size="sm")
                    img(src="avatar-placeholder.png")
                  q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
                    img(src="avatar-placeholder.png")
                  q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
                    img(src="avatar-placeholder.png")
                .text-subtitle2.text-italic.on-right and other 12
    .col-3.q-pl-sm
      .row.q-mb-sm
        widget
          .row.items-center.justify-between.q-my-md
            .text-h6 Archetypes
            q-btn(flat color="primary" rounded no-caps :to="{ name: 'archetypes' }") See more
          .row.q-mb-md
            .text-grey-7 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          .row.q-pa-sm
            button-radio(hide-icon horizontal title="Researching and Architecting")
          .row.q-pa-sm
            button-radio(hide-icon horizontal title="Storytelling and Communicating")
          .row.q-pa-sm
            button-radio(hide-icon horizontal title="Building and Developing")
      .row.q-my-md
        widget.full-width
          .row.items-center.justify-between.q-my-md
            .text-h6 Policies
            q-btn(flat color="primary" rounded no-caps :to="{ name: 'policies' }") See more
          .row.q-mb-md
            .text-grey-7 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          .row.q-pa-sm
            button-radio(hide-icon title="Policy #1" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
          .row.q-pa-sm
            button-radio(hide-icon title="Policy #2" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
          .row.q-pa-sm
            button-radio(hide-icon title="Policy #3" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.")
</template>

<style lang="stylus" scoped>
.close-btn
  z-index 1

.icon
  width 40px

.amount
  height 40px
  border-radius 16px
  background-color $grey-4
</style>
