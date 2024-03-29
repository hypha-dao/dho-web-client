<script>
import { mapActions, mapGetters } from 'vuex'
import { timeZones } from '~/mixins/time-zones'
import { validation } from '~/mixins/validation'
import { calcVoicePercentage } from '~/utils/eosio'
import { dateToStringShort } from '~/utils/TimeUtils'

import 'vue-croppa/dist/vue-croppa.css'

export default {
  name: 'profile-card',
  mixins: [timeZones, validation],
  components: {
    Chips: () => import('../common/chips.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    WidgetEditable: () => import('../common/widget-editable.vue'),
    ImageProcessor: () => import('~/components/form/image-processor')

  },

  props: {
    username: String,
    joinedDate: String,
    view: String,
    isApplicant: Boolean,
    editButton: Boolean,
    compact: Boolean,
    clickable: {
      type: Boolean,
      default: true
    },
    canEnroll: Boolean,
    isCommunityMember: Boolean,
    isCoreMember: Boolean,
    badges: Array,
    isElection: Boolean,
    electionState: String
  },

  data () {
    return {
      time: '',
      timezone: '',
      publicData: {
        bio: ''
      },
      voiceToken: {
        token: '',
        amount: 0
      },
      voiceTokenPercentage: 0.0,
      submittingEnroll: false,
      hVoice: 0.0,
      editable: false,
      savable: false,
      form: {
        avatar: undefined,
        name: undefined,
        timeZone: undefined
      },
      image: {},
      timeZonesFilteredOptions: []
    }
  },

  computed: {
    ...mapGetters('accounts', ['isAdmin', 'isEnroller']),

    card () { return this.view === 'card' },
    list () { return this.view === 'list' },
    joinedDateFormatted () { return dateToStringShort(this.joinedDate) },

    title () { return this.publicData ? this.publicData.name : this.username },
    subtitle () { return this.username }
  },

  watch: {
    username: {
      handler: async function () {
        await this.updateProfileData(this.username)
      },
      immediate: true
    },
    'form.name': {
      handler: async function () {
        this.savable = await this.isSavable()
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions('profiles', ['getVoiceToken']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('treasury', ['getSupply']),
    ...mapActions('accounts', ['enrollMember', 'removeApplicant']),

    // How do we optimize this repeated profile requests?
    async getProfileDataFromContract (username) {
      let voiceTokenPercentage = '0.0'
      let publicData = {
        name: username,
        bio: ''
      }

      const profile = await this.getPublicProfile(username)

      if (profile) {
        publicData = profile.publicData
      }

      const selectedTimeZone = profile ? (profile.publicData.timeZone ? profile.publicData.timeZone : 'utc') : 'utc'
      const tz = this.timeZonesOptions.find(v => v.value === selectedTimeZone)
      const timezone = tz.text.replace('(', '').replace(/\).*$/, '')
      const time = new Date(new Date().toLocaleString('en-US', { timeZone: tz.utc[0] })).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      const [voiceToken, supplyTokens] = await Promise.all([
        this.getVoiceToken(username),
        this.getSupply()
      ])

      if (supplyTokens && voiceToken.token && supplyTokens[voiceToken.token]) {
        const supplyHVoice = parseFloat(supplyTokens[voiceToken.token])
        voiceTokenPercentage = supplyHVoice ? calcVoicePercentage(parseFloat(voiceToken.amount), supplyHVoice) : '0.0'
      }
      return {
        publicData,
        voiceTokenPercentage,
        timezone,
        time,
        voiceToken,
        supplyTokens,
        tz
      }
    },

    onClick () {
      if (this.username) {
        this.$router.push({ name: 'profile', params: { username: this.username } })
      }
    },

    async onRemoveApplicant (event) {
      event.stopPropagation()
      this.submittingEnroll = true
      try {
        const res = await this.removeApplicant({
          applicant: this.username
        })
        if (res) {
          this.$EventBus.$emit('membersUpdated')
        }
        this.submittingEnroll = false
      } catch (error) {
        this.submittingEnroll = false
      }
    },

    async onEnroll (event) {
      event.stopPropagation()
      this.submittingEnroll = true
      try {
        const res = await this.enrollMember({
          applicant: this.username,
          content: 'DAO Enroll member'
        })
        if (res) {
          this.$EventBus.$emit('membersUpdated')
        }
        this.submittingEnroll = false
      } catch (error) {
        this.submittingEnroll = false
      }
    },

    async isSavable () {
      const valid = await this.validateForm()
      return valid
    },

    cancel () {
      this.editable = false
      this.resetForm()
    },

    async updateProfileData () {
      const username = this.username
      const data = await this.getProfileDataFromContract(username)
      if (username === this.username) {
        this.publicData = data.publicData
        this.voiceTokenPercentage = data.voiceTokenPercentage
        this.timezone = data.timezone
        this.time = data.time
        this.voiceToken = data.voiceToken
        this.supplyTokens = data.supplyTokens
        const timeZone = data.tz
        this.resetForm()
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.interval = setInterval(() => {
          this.time = new Date(new Date().toLocaleString('en-US', { timeZone: timeZone.utc[0] })).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }, 1000)
      }
    },

    async save (success, fail) {
      this.form.avatar = await this.getImageBlob()
      this.$emit('onSave', this.form, async () => {
        await this.updateProfileData()
        this.$refs.profilePic.reload()
        success()
      }, fail)
      this.editable = false
    },

    onEdit () {
      this.savable = true
      this.editable = true
    },

    async validateForm () {
      await this.resetValidation(this.form)
      return await this.validate(this.form)
    },

    resetForm () {
      this.form = {
        avatar: undefined,
        name: this.publicData.name,
        timeZone: this.publicData.timeZone
      }
    },

    getImageBlob () {
      return new Promise((resolve, reject) => {
        try {
          if (this.image.hasImage()) {
            this.image.generateBlob((blob) => {
              resolve(blob)
            }, 'image/jpg', 0.8)
          } else {
            resolve(null)
          }
        } catch (e) {
          reject(new Error(e))
        }
      })
    },

    filterTimeZones (val, update) {
      if (val === '') {
        update(() => {
          this.timeZonesFilteredOptions = this.timeZonesOptions
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.timeZonesFilteredOptions = this.timeZonesOptions.filter(
          v => v.text.toLowerCase().indexOf(needle) > -1
        )
      })
    }
  }
}
</script>

<template lang="pug">
widget-editable.relative-position.q-pa-md(:class="{ 'full-width': list, 'cursor-pointer': !editButton && clickable }" :editable="editButton" :savable="savable" @click.native="(!editButton && clickable) ? onClick() : null" @onCancel="cancel" @onEdit="onEdit" @onFail="resetForm" @onSave="save" no-padding="no-padding")
  .flex.justify-center.q-mb-sm(v-if="isCommunityMember || isCoreMember")
    chips(:tags="[{ outline: false, color: 'secondary', label: $t('profiles.profile-card.community') }]" v-if="isCommunityMember" chipSize="sm")
    chips(:tags="[{ outline: false, color: 'primary', label: $t('profiles.profile-card.coreTeam') }]" v-if="isCoreMember" chipSize="sm")

  .absolute.z-topq-pa-sm(v-if="!isApplicant" :style="{ 'top': '0px', 'right': '0px' }")
    q-btn.q-pa-xs(
      @click="e => e.stopPropagation()"
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
          q-item(@click="$emit('remove', username)" clickable v-close-popup)
            q-item-section {{ $t('actions.remove') }}

  .row.items-arround.flex(v-if="!editable" :style="{ 'height': isElection ? '230px' : card ? '324px' : '80px' }")
    .col-auto(:class="{ 'col-12': card, 'q-pr-xl': list}")
      .column.relative(:class="{ 'items-center': card }")
        profile-picture(:username="username" :size="list ? '82px' : '140px'" ref="profilePic")
        .badges.absolute.flex(v-if="badges?.length && !isApplicant" :style="{ 'top': '150px', 'right': '40px' }")
          template(v-if="badges[0].details_icon_s.includes('icon')")
            .flex.items-center.justify-center(:style="{'width': '36px', 'height': '36px', 'border-radius': '50%', 'background': '#242F5D', 'border': '1px solid white'}")
              q-icon(:name="badges[0].details_icon_s.replace('icon:', '')" color="white" width="36px" height="36px")
          template(v-else)
            img(:src="badges[0].details_icon_s" width="36px" height="36px" :style="{'border': '1px solid white', 'border-radius': '50%'}")
          .absolute.flex.items-center.justify-center.font-lato.text-bold(v-if="badges.length > 1" :style="{'width': '28px', 'height': '28px', 'border-radius': '50%', 'background': '#242F5D', 'color': 'white', 'font-size': '12px', 'border': '1px solid white', 'right': '-20px', 'top': '5px'}") {{ `+ ${badges.length - 1}` }}
    .col.q-mb-xxs(:class="{ 'col-12': card, 'text-center': card, 'q-mt-lg': card && !isElection }")
      .column.flex.justify-center.full-height(:class="{ 'items-center': card }")
        chips(:tags="[{ outline: false, color: 'secondary', label: $t('profiles.profile-card.applicant') }]" v-if="isApplicant" chipSize="sm")
        .h-h3 {{ title }}

          q-tooltip {{title}}
        .h-b3.text-weight-thin.text-grey-7 {{ '@' + subtitle }}
    .col-7.row.items-center(:class="{ 'col-12': card }" v-if="!isApplicant && !isElection")
      .col-4.justify-center(:class="{ 'row items-center': list }")
        .items-center(:class="{ 'row': list, 'column': card }")
          q-icon.q-py-xs(color="grey-7" name="fas fa-calendar-alt")
          .text-grey-7.h-b2.q-pl-xs.q-pr-xxs {{ joinedDateFormatted.split(',')[0] }}
            | ,
            .text-grey-7.h-b2 {{ joinedDateFormatted.split(',')[1] }}
      .col-4.justify-center.border(:class="{ 'row items-center': list }")
        .items-center(:class="{ 'row': list, 'column': card }")
          q-icon.q-py-xs(color="grey-7" name="fas fa-map-marker-alt")
          .text-grey-7.h-b2.q-px-xs {{ timezone }}
          .text-grey-7.h-b2 {{ time }}
      .col-4.justify-center.border(:class="{ 'row items-center': list }")
        .items-center(:class="{ 'row': list, 'column': card }")
          q-icon.q-py-xs(color="grey-7" name="fas fa-vote-yea")
          .text-grey-7.h-b2.q-px-xs {{ voiceTokenPercentage }}
            | %
          .text-grey-7.h-b2 {{ voiceToken.token }}

    .col-auto(:class="{ 'col-12': card, 'col-7': isEnroller, 'q-px-xs': card }" v-if="isApplicant")
      .row.items-center.justify-end.full-height
        .col-4(:class="{ 'text-center': card , 'col-12': card, 'q-mt-md': card, 'justify-end flex': $q.screen.gt.md }" v-if="isEnroller")
          q-btn(:style="{ 'border-radius': '50%' }" :disable="!canEnroll" :loading="submittingEnroll" :icon="'fas fa-times'" @click="onRemoveApplicant" color="negative" no-caps rounded unelevated)
          q-btn.q-ml-xs(:style="{ 'border-radius': '50%' }" :disable="!canEnroll" :loading="submittingEnroll" :icon="'fas fa-check'" @click="onEnroll" color="positive" no-caps rounded unelevated)

  .row.items-center(v-else :style="{ 'height': card ? '358px' : '113px' }")
    .col-2.q-pt-md.q-mb-xs.justify-center.flex(:class="{ 'col-12': card }")
      croppa.image-selector.q-mb-lg(v-model="image" :show-remove-button="false" :replace-drop="true" :canvas-color="'#3E3B46CC'" :placeholder="'UPLOAD A NEW PROFILE PIC'" :placeholder-font-size="8" :placeholder-color="'#FFFFFF'" :accept="'image/*'" :file-size-limit="4e6" :width="140" :height="140" :quality="1" prevent-white-space="prevent-white-space")
      q-input.full-width.rounded-border.q-mt-xl(ref="name" v-model="form.name" :label="$t('profiles.profile-card.name')" maxlength="200" :rules="[rules.required]" lazy-rules outlined dense)
      q-select.full-width.rounded-border(dropdown-icon="fas fa-map-marker-alt" outlined hide-bottom-space v-model="form.timeZone" use-input="use-input" fill-input="fill-input" hide-selected="hide-selected" dense :label="$t('profiles.profile-card.timeZone')" :options="timeZonesFilteredOptions" @filter="filterTimeZones" option-value="value" :option-label="$t('profiles.profile-card.text')" emit-value map-options)
  .col.text-black.text-bold.q-my-md.q-pt-md(v-if="isElection && electionState !== 'finish'" :style="{ 'font-weight': '600', 'border-top': '1px solid #CBCDD1' }")
    .row.q-mb-xs.flex.justify-between.items-center
      div {{ $t('profiles.profile-card.voteForYourself') }}
      q-icon(name="fas fa-times" color="grey" size="20px")
    .row.flex.justify-between.items-center
      div {{ $t('profiles.profile-card.reachConsensus') }}
      q-icon(name="fas fa-times" color="grey" size="20px")
  q-btn.full-width(@click="" color="primary" flat :label="$t('profiles.profile-card.viewMyGroup')" no-caps bordered rounded v-if="isElection && electionState !== 'finish'" :style="{'border': '1px solid #252f5d'}")
</template>

<style lang="stylus" scoped>
.applicant-description
  overflow-wrap anywhere

.border
  border-left 1px solid $internal-bg
  border-right 1px solid $internal-bg

.image-selector
  width 140px
  height 140px
  border-radius 50%
  overflow hidden
  -webkit-mask-image: -webkit-radial-gradient(white, black);

.name-text
  text-overflow ellipsis
  overflow hidden
  width 220px
</style>
