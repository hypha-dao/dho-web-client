<script>
export default {
  name: 'Login'
}
</script>

<template lang="pug">
.fullscreen
    .contain-bg.full-height.full-width
        .welcome-bg.full-height.full-width
        .welcome-fg.full-height.full-width
        .swirl
        .row.full-height
            .col-3
                q-card.full-height.card-container
                    div
                        .text-h6 Form
</template>

<style lang="stylus" scoped>
.contain-bg
    position: relative
.welcome-bg
  background-image: url('../../assets/images/loginBg.png')
  background-repeat: no-repeat
  background-size: cover
  position: absolute
.welcome-fg
    // background: #1B2B5E
    background: $primary
    position: absolute
    z-index: 2
    opacity: 0.85
.swirl
    background: transparent url('../../assets/images/swirl.png') 0% 0% no-repeat padding-box
    background-repeat: no-repeat
    background-size: contain
    position: absolute
    // background-color: $secondary
    z-index: 3
    top: 10
    right: 0
    height: 70%
    width: 70%
    margin-right: -25%
    margin-top: -20%
    transform: matrix(-0.68, -0.73, 0.73, -0.68, 0, 0) rotate(180deg);
    transition: rotate 2s;

.card-container
    z-index: 5
</style>
