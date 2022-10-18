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
    }
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
    ...mapGetters('accounts', ['isEnroller']),

    list () {
      return this.view === 'list'
    },

    card () {
      return this.view === 'card'
    },

    joinedDateFormatted () {
      return dateToStringShort(this.joinedDate)
    }
  },
  watch: {
    username: {
      handler: async function () {
        await this.getProfileDataFromContract()
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
    ...mapActions('accounts', ['enrollMember']),

    // How do we optimize this repeated profile requests?
    async getProfileDataFromContract () {
      try {
        this.voiceTokenPercentage = '0.0'
        this.publicData = {
          name: this.username,
          bio: ''
        }

      const profile = await this.getPublicProfile(this.username)

        const selectedTimeZone = profile ? profile.publicData.timeZone : 'utc'
        const tz = this.timeZonesOptions.find(v => v.value === selectedTimeZone)
        this.timezone = tz.text.replace('(', '').replace(/\).*$/, '')
        setInterval(() => {
          this.time = new Date(new Date().toLocaleString('en-US', { timeZone: tz.utc[0] })).toLocaleTimeString()
        }, 1000)
      } catch (error) {
      }

      try {
      this.voiceToken = await this.getVoiceToken(this.username)
      const supplyTokens = await this.getSupply()
      if (supplyTokens && this.voiceToken.token && supplyTokens[this.voiceToken.token]) {
        const supplyHVoice = parseFloat(supplyTokens[this.voiceToken.token])
        this.voiceTokenPercentage = supplyHVoice ? calcVoicePercentage(parseFloat(this.voiceToken.amount), supplyHVoice) : '0.0'
      }
      } catch (error) {
      }
    },

    onClick () {
      if (this.username) {
        this.$router.push({ name: 'profile', params: { username: this.username } })
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

    async save (success, fail) {
      this.form.avatar = await this.getImageBlob()
      this.$emit('onSave', this.form, async () => {
        await this.getProfileDataFromContract()
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
widget-editable(
  :class="{ 'full-width': list, 'cursor-pointer': !editButton && clickable }"
  :editable= "editButton"
  :savable= "savable"
  @click.native="(!editButton && clickable) ? onClick() : null"
  @onCancel="cancel"
  @onEdit="onEdit"
  @onFail="resetForm"
  @onSave="save"
  no-padding
).q-pa-md
  .row.items-arround.flex(v-if="!editable" :style="{ 'height': card ? '324px' : '80px' }")
    .col-auto(:class="{ 'col-12': card, 'q-pr-xl': list}")
      .column(:class="{ 'items-center': card }")
        profile-picture(:username="username" :size="list ? '82px' : '140px'" ref="profilePic")
    .col.q-mb-xxs(:class="{ 'col-12': card, 'text-center': card, 'q-mt-lg': card  }")
      .column(:class="{ 'items-center': card }").flex.justify-center.full-height
        //- chips(:tags="[{ outline: true, color: 'primary', label: 'CIRCLE NAME' }]" v-if="!isApplicant" chipSize="sm") Removed for MVP
        chips(:tags="[{ outline: false, color: 'secondary', label: 'APPLICANT' }]" v-if="isApplicant" chipSize="sm")
        .h-h3 {{ publicData.name }}
          q-tooltip {{publicData.name}}
        .h-b3.text-weight-thin.text-grey-7 {{ '@' + username }}

    .col-7.row.items-center(:class="{ 'col-12': card }" v-if="!isApplicant")
      .col-4.justify-center(:class="{ 'row items-center': list }")
        .items-center(:class="{ 'row': list, 'column': card }")
          q-icon.q-py-xs(color="grey-7" name="fas fa-calendar-alt")
          .text-grey-7.h-b2.q-pl-xs.q-pr-xxs {{ joinedDateFormatted.split(',')[0] }},
            .text-grey-7.h-b2 {{ joinedDateFormatted.split(',')[1] }}
      .col-4.justify-center(:class="{ 'row items-center': list }").border
        .items-center(:class="{ 'row': list, 'column': card }")
          q-icon.q-py-xs(color="grey-7" name="fas fa-map-marker-alt")
          .text-grey-7.h-b2.q-px-xs {{ timezone }}
          .text-grey-7.h-b2 {{ time }}
      .col-4.justify-center(:class="{ 'row items-center': list }")
        .items-center(:class="{ 'row': list, 'column': card }")
          q-icon.q-py-xs(color="grey-7" name="fas fa-vote-yea")
          .text-grey-7.text-no-wrap.h-b2.q-px-xs {{ voiceTokenPercentage }}%
            .text-grey-7.text-no-wrap.h-b2 {{ voiceToken.token }}

    .col-auto(:class="{ 'col-12': card, 'col-7': isEnroller, 'q-px-xs': card }" v-if="isApplicant")
      .row.items-center.justify-end.full-height
        //- .col-8(:class="{ 'text-center': card, 'col-12': !isEnroller || card }")
        //-   .items-center(:class="{ 'row': list, 'column': card }")
        //-     .text-grey-7.body2.applicant-description(v-if="!isEnroller || list") {{publicData.bio && (publicData.bio.substr(0, card ? 90 : 200) + (publicData.bio.length > (card ? 90 : 200) ? "..." : ""))}}
        .col-4(:class="{ 'text-center': card , 'col-12': card, 'q-mt-md': card}" v-if= "isEnroller")
          q-btn.full-width(
          color="primary"
          no-caps
          unelevated
          rounded
          label="Enroll"
          @click="onEnroll"
          :loading="submittingEnroll")
  //- EDIT SECTION
  .row.items-center(v-else :style="{ 'height': card ? '358px' : '113px' }")
    .col-2.q-pt-md.q-mb-xs.justify-center.flex(:class="{ 'col-12': card }")
      croppa.image-selector.q-mb-lg(
        v-model="image"
        :show-remove-button="false"
        :replace-drop="true"
        :canvas-color="'#3E3B46CC'"
        :placeholder="'UPLOAD A NEW PROFILE PIC'"
        :placeholder-font-size="8"
        :placeholder-color="'#FFFFFF'"
        :accept="'image/*'"
        :file-size-limit="4e6"
        :width="140"
        :height="140"
        :quality="1"
        prevent-white-space
      )
        //- img(:src="this.publicData.avatar" slot="placeholder")
      q-input.full-width.rounded-border.q-mt-xl(
        ref="name"
        v-model="form.name"
        label="Name"
        maxlength="200"
        :rules="[rules.required]"
        lazy-rules
        outlined
        dense
      )
      q-select.full-width.rounded-border(
        dropdown-icon="fas fa-map-marker-alt"
        outlined
        hide-bottom-space
        v-model='form.timeZone'
        use-input
        fill-input
        hide-selected
        dense
        label="Time zone"
        :options="timeZonesFilteredOptions"
        @filter="filterTimeZones"
        option-value="value"
        option-label="text"
        emit-value,
        map-options
      )
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

.rounded-border
  :first-child
    border-radius 15px

.name-text
  text-overflow ellipsis
  overflow hidden
  width 220px
</style>
