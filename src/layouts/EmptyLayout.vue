<script>
export default {
  name: 'empty-layout'
}
</script>

<template lang="pug">
q-layout.bg-white(view="lHr LpR fFf" ref="layout")
    q-page-container.window-height.q-py-md(:class="{ 'q-pr-md': $q.screen.gt.sm }")
        q-scroll-area.full-height(:thumb-style=" { 'border-radius': '6px' }" ref="scrollArea")
            .row.justify-center
                .col-md-10.col-sm-11.col-xs-11
                    q-card.card-container.bg-internal-bg.q-pa-md
                        router-view
</template>

<style lang="sass" scoped>
.card-container
  min-height: 88vh
  border-radius: 20px
</style>
