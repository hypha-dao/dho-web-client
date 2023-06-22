<script>

export default {
  name: 'settings-communicaiton',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    form: {
      type: Object,
      default: () => {}
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    isHypha: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    toggleOff (name, activeIndex, value) {
      if (this.form[name].length > 1 && value) {
        this.$emit('change', name, this.form[name].map((_, index) => ({ ..._, enabled: index === activeIndex })))
      }
    }
  }
}
</script>

<template lang="pug">
.settings-communicaiton
  widget.q-pa-none.full-width.q-mt-md(:title="$t('dao.settings-communication.announcements')" titleImage="/svg/paperplane.svg" :bar="true")
    p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('dao.settings-communication.postAnAnnouncement') }}
    template(v-for="(announcement, index) in form.announcements")
      .row.q-mt-sm
        .row.full-width.items-end
          .col
            label.h-label {{ $t('dao.settings-communication.title') }}
          .col-auto
            q-toggle(v-model="announcement.enabled" color="secondary" :disable="!isAdmin" @input="(value) => toggleOff('announcements',index, value)")
          .col-12
            q-input.q-my-sm.rounded-border(:debounce="200" :disable="!isAdmin" :ref="'announcement.' + index + '.content'" bg-color="white" color="accent" dense="dense" lazy-rules="lazy-rules" outlined="outlined" placeholder="Enter your message here" rounded="rounded" v-model="announcement.title")
        .full-width
          label.h-label {{ $t('dao.settings-communication.message') }}
          q-field.full-width.q-my-sm.rounded-border(dense="dense" lazy-rules="lazy-rules" maxlength="3000" outlined="outlined" ref="bio" stack-label="stack-label" v-model="announcement.message")
            q-editor.full-width(:disable="!isAdmin" :toolbar="[['bold', 'italic', /*'strike', 'underline'*/],['token', 'hr', 'link', 'custom_btn'],['quote', 'unordered', 'ordered']]" flat="flat" placeholder="Max 140 characters" v-model="announcement.message")
      nav.row.full-width.justify-end
        q-btn.text-bold.q-pa-none.q-mr-xs(:disable="form.announcements.length === 1 || !isAdmin" flat="flat" color="primary" no-caps="no-caps" padding="none" @click="form.announcements.splice(index, 1)") {{ $t('dao.settings-communication.removeAnnouncement') }}
        q-btn.text-bold.q-pa-none.q-ml-lg.q-mr-xs(:disable="form.announcements.length === 10 || !isAdmin" v-show="index === form.announcements.length - 1" flat="flat" color="primary" no-caps="no-caps" padding="none" @click="form.alerts.push({content:'', enabled:false, level:'default' })") {{ $t('dao.settings-communication.addMore') }}
  widget.q-pa-none.full-width.q-mt-md(title="Alerts" titleImage="/svg/bell.svg" :bar="true" v-if="isHypha")
    p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('dao.settings-communication.onlyForHypha') }}
    template(v-for="(alert, index) in form.alerts")
      .row.ju.q-mt-md.items-end
        .col
          label.h-label {{ $t('dao.settings-communication.alert') }}
            | {{ index + 1 }}
        .col-auto
          q-toggle(v-model="alert.enabled" color="secondary" :disable="!isAdmin" @input="(value) => toggleOff('alerts',index, value)")
      .row.items-end.full-width.q-my-sm
        .col-auto
          q-btn(unelevated="unelevated" padding="0")
            q-avatar(size="40px" :color="alert.level")
            q-icon.q-mx-xs(name="fas fa-chevron-down" size="12px")
            q-menu
              q-list(style="min-width: 140px")
                q-item.q-px-sm(clickable="clickable" v-close-popup="v-close-popup" @click="alert.level = 'positive'")
                  q-item-section
                    q-avatar(size="20px" color="positive")
                  q-item-section {{ $t('dao.settings-communication.positive') }}
                q-item.q-px-sm(clickable="clickable" v-close-popup="v-close-popup" @click="alert.level = 'negative'")
                  q-item-section
                    q-avatar(size="20px" color="negative")
                  q-item-section {{ $t('dao.settings-communication.negative') }}
                q-item.q-px-sm(clickable="clickable" v-close-popup="v-close-popup" @click="alert.level = 'warning'")
                  q-item-section
                    q-avatar(size="20px" color="warning")
                  q-item-section {{ $t('dao.settings-communication.warning') }}
        .col
          q-input.rounded-border(:debounce="200" :disable="!isAdmin" :ref="'alert.' + index + '.content'" bg-color="white" color="accent" dense="dense" lazy-rules="lazy-rules" maxlength="200" outlined="outlined" placeholder="Enter your message here" rounded="rounded" v-model="alert.content")
      nav.row.full-width.justify-end
        q-btn.text-bold.q-pa-none.q-mr-xs(:disable="form.alerts.length === 1 || !isAdmin" flat="flat" color="primary" no-caps="no-caps" padding="none" @click="form.alerts.splice(index, 1)") {{ $t('dao.settings-communication.removeNotification') }}
        q-btn.text-bold.q-pa-none.q-ml-lg.q-mr-xs(:disable="form.alerts.length === 10 || !isAdmin" v-show="index === form.alerts.length - 1" flat="flat" color="primary" no-caps="no-caps" padding="none" @click="form.alerts.push({content:'', enabled:false, level:'default' })") {{ $t('dao.settings-communication.addMore') }}
</template>

<style lang="stylus" scoped>
/deep/.q-field__control-container
  padding: 1px !important;

.q-editor__content
    color: red !important;
</style>
