<script>
const PROFILE_OPTIONS = [
  {
    tab: 'profile',
    section: 'Profile',
    icon: 'fas fa-users-cog',
    values: [
      {
        label: 'Name',
        type: String,
        value: ''
      },
      {
        label: 'Nickname',
        type: String,
        value: ''
      },
      {
        label: 'Location / Time Zone',
        type: String
      },
      {
        label: 'Tags',
        type: String
      }
    ]
  },
  {
    tab: 'contact',
    section: 'How to reach me',
    icon: 'fas fa-phone-volume',
    values: [
      {
        label: 'Contact Method',
        type: String,
        value: ''
      },
      {
        label: 'Email',
        type: String,
        value: ''
      },
      {
        label: 'Phone Number',
        type: String
      }
    ]
  },
  {
    tab: 'bio',
    section: 'Bio',
    icon: 'fas fa-align-justify',
    values: [
      {
        label: 'About',
        type: String,
        value: ''
      }
    ]
  },
  {
    tab: 'token',
    section: 'Token Redemption',
    icon: 'fas fa-donate',
    values: [
      {
        label: 'EOS Account',
        type: String,
        value: ''
      },
      {
        label: 'ETH Address',
        type: String,
        value: ''
      },
      {
        label: 'BTC Address',
        type: String,
        value: ''
      }
    ]
  }
]

export default {
  name: 'edit-dialog',

  data () {
    return {
      options: PROFILE_OPTIONS,
      tab: 'profile'
    }
  }
}
</script>

<template lang="pug">
q-card.edit-dialog.bg-white.relative-position
  q-btn.save-button.absolute-bottom-right.q-mr-md.q-mb-md(color="primary") Save
  .row
    .left.gt-sm
      .avatar.flex.column.justify-center.q-py-md
        .flex.justify-center
          q-avatar(size="64px").q-my-sm
            // img(src="~/assets/avatar-placeholder.png")
        .text-center @lukegravdent
      .text-bold.text-grey.q-mt-lg
        q-list
          q-item(v-for="opt in options"
            clickable
            v-ripple
            :key="opt.section"
            :class="{ 'text-black': tab === opt.tab }"
            @click="tab = opt.tab"
          )
            q-item-section {{ opt.section }}
            q-item-section(avatar)
              q-icon(:name="opt.icon")
    .details.col
      .text-h5.q-ma-lg.q-mt-xl.q-ml-xl Account Settings
      q-scroll-area.scroll
        .q-pa-lg.q-gutter-xl
          template(v-for="opt in options")
            .section.bg-grey-2.q-pa-md(v-if="tab === opt.tab || $q.screen.lt.md")
              .text-h6.q-ml-sm.lt-md {{ opt.section }}
              template(v-for="val in opt.values")
                q-input.q-ma-lg(
                  outlined
                  v-model="val.value"
                  :label="val.label"
                  :key="val.label"
                )
</template>

<style lang="stylus" scoped>
.edit-dialog
  height 675px
  width 800px
  max-width 80vw
  max-height 80vh
  padding-bottom 80px

  .save-button
    width 200px

  .avatar
    width 200px
    height 200px
    background-color #EBF4F8

  .scroll
    height 440px
    max-height calc(80vh - 175px)

  .section
    border-radius 16px
</style>
