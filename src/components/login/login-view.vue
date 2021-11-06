<script>
export default {
  name: 'welcome-view'
}
</script>

<template lang="pug">
.full-width.full-height
  .absolute-center.full-width.q-pa-xl
    .text-h4 Login to
      span.text-h4.text-bold  your
    .text-h4.text-bold account
    .text-body2.text-weight-thin.q-mt-lg.q-mb-lg.text-grey Welcome! Please login with one of the wallets, your private key or continue as guest. For improved security, we recommend to download and install the Anchor wallet.
    .col-xs-12.col-md-6.q-mt-xl
      q-list
        q-item.wallet(
          v-for="(wallet, idx) in $ual.authenticators"
          :key="wallet.getStyle().text"
          v-ripple
          :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }"
          dense
        )
          q-item-section.cursor-pointer(
            avatar
            @click="onLoginWallet(idx)"
          )
            img(
              :src="wallet.getStyle().icon"
              width="20"
            )
          q-item-section.cursor-pointer.text-center.text-capitalize(@click="onLoginWallet(idx)") {{ wallet.getStyle().text }}
          q-item-section(avatar)
            .flex
              q-spinner(
                v-if="loading === wallet.getStyle().text"
                :color="wallet.getStyle().textColor"
                size="2em"
              )
              q-btn(
                v-else
                :color="wallet.getStyle().textColor"
                icon="fas fa-download"
                @click="openUrl(wallet.getOnboardingLink())"
                target="_blank"
                dense
                flat
                size="10px"
              )
                q-tooltip Get app
        q-item.wallet.text-white(
          style="background:#666666"
          v-ripple
          dense
        )
          q-item-section.cursor-pointer(
                avatar
              )
                //- img(
                //-   :src=""
                //-   width="30"
                //- )
          q-item-section.cursor-pointer.text-center.text-capitalize(
            @click="pkForm = !pkForm"
          ) Private KEY
          q-item-section(avatar)
</template>

<style lang="stylus" scoped>
.wallet
  border-radius 25px
  margin-bottom 10px
  text-transform uppercase
  font-weight 600
</style>
