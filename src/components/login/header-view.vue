<script>
export default {
  name: 'header-view',
  props: {
    /**
     * Selected step from Login screen
     */
    step: String,
    /**
     * All possibles steps from Login screens
     */
    steps: Object
  }
}
</script>

<template lang="pug">
.full-width
    .row.justify-between.q-mb-md
        .hypha-logo
        .span-text.text-weight-thin.text-grey(v-if="step === steps.login") New User?
            span.text-body2.span-text.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickRegisterHere')") Register here
        .span-text.text-weight-thin.text-grey(v-else-if="step === steps.register") Are you a member?
            span.text-body2.span-text.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickRegisterHere')") Login here
</template>

<style lang="stylus" scoped>
.hypha-logo
    background-image: url('./../../assets/logos/hypha-logo-color-orizontal.svg')
    width: 60px
    height: 30px
    background-repeat: no-repeat
    background-size: contain
.span-text
  font-size: 13px
</style>
