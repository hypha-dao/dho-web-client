<script>
export default {
  name: 'templates-modal',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  data () {
    return {
      currentStepIndex: 0
    }
  },
  props: {
    activated: Boolean
  },

  methods: {}
}
</script>

<template lang="pug">
.templates-modal
  q-dialog(:value="activated" full-width)
    widget(:style="{ 'max-width': '1180px !important' }" title="Customize your dao")
      .q-pt-xl
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
</template>

<styles lang="stylus" scoped>
.card
  height: 100%
  box-shadow: 0px 0px 30px #0000001F
  border-radius: 25px
</styles>
