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
  widget(title='Announcements' titleImage='/svg/paperplane.svg' :bar='true').q-pa-none.full-width.q-mt-md
    p.q-mt-md.subtitle Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    template(v-for="(announcement, index) in form.announcements")
      .row.q-mt-sm
        .col
          label.h-label Title
          q-input.q-my-sm.rounded-border(
            :debounce="200"
            :disable="!isAdmin"
            :ref="'announcement.' + index + '.content'"
            bg-color="white"
            color="accent"
            dense
            lazy-rules
            outlined
            placeholder="Enter your message here"
            rounded
            v-model="announcement.title"
          )
        .col-auto.q-pt-xxl
          q-toggle(v-model="announcement.enabled" color="secondary" :disable="!isAdmin" @input="(value) => toggleOff('announcements',index, value)")
        .full-width
            label.h-label Message
            q-field.full-width.q-my-sm.rounded-border(
              dense
              lazy-rules
              maxlength="3000"
              outlined
              ref="bio"
              stack-label
              v-model="announcement.message"
            )
              q-editor.full-width(
                :toolbar="[['bold', 'italic', /*'strike', 'underline'*/],['token', 'hr', 'link', 'custom_btn'],['quote', 'unordered', 'ordered']]"
                flat
                placeholder="Max 140 characters"
                v-model="announcement.message"
              )

      nav.row.full-width.justify-end
        q-btn(:disable="form.announcements.length === 1 || !isAdmin" flat color="primary" no-caps padding="none" @click="form.announcements.splice(index, 1)").text-bold.q-pa-none.q-mr-xs Remove announcement -
        q-btn(:disable="form.announcements.length === 10 || !isAdmin" v-show="index === form.announcements.length - 1" flat color="primary" no-caps padding="none" @click="form.alerts.push({content:'', enabled:false, level:'default' })").text-bold.q-pa-none.q-ml-lg.q-mr-xs Add more +

  widget(title='Alerts' titleImage='/svg/bell.svg' :bar='true' v-if="isHypha").q-pa-none.full-width.q-mt-md
    p.q-mt-md.subtitle Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    template(v-for="(alert, index) in form.alerts")
      .row.ju.q-mt-sm
        label.h-label Alert {{ index + 1 }}
        .row.items-end.full-width.q-my-sm
          .col-auto
            q-btn(unelevated padding="0")
              q-avatar(size="40px" :color="alert.level")
              q-icon.q-mx-xs(name='fas fa-chevron-down' size='12px')
              q-menu
                q-list(style='min-width: 140px')
                  q-item(clickable v-close-popup @click="alert.level = 'positive'").q-px-sm
                    q-item-section
                      q-avatar(size="20px" color="positive")
                    q-item-section Positive

                  q-item(clickable v-close-popup @click="alert.level = 'negative'").q-px-sm
                    q-item-section
                      q-avatar(size="20px" color="negative")
                    q-item-section Negative

                  q-item(clickable v-close-popup @click="alert.level = 'warning'").q-px-sm
                    q-item-section
                      q-avatar(size="20px" color="warning")
                    q-item-section Warning

          .col
            q-input.rounded-border(
              :debounce="200"
              :disable="!isAdmin"
              :ref="'alert.' + index + '.content'"
              bg-color="white"
              color="accent"
              dense
              lazy-rules
              maxlength="200"
              outlined
              placeholder="Enter your message here"
              rounded
              v-model="alert.content"
            )
          .col-auto
            q-toggle(v-model="alert.enabled" color="secondary" :disable="!isAdmin" @input="(value) => toggleOff('alerts',index, value)")

      nav.row.full-width.justify-end
        q-btn(:disable="form.alerts.length === 1 || !isAdmin" flat color="primary" no-caps padding="none" @click="form.alerts.splice(index, 1)").text-bold.q-pa-none.q-mr-xs Remove notification -
        q-btn(:disable="form.alerts.length === 10 || !isAdmin" v-show="index === form.alerts.length - 1" flat color="primary" no-caps padding="none" @click="form.alerts.push({content:'', enabled:false, level:'default' })").text-bold.q-pa-none.q-ml-lg.q-mr-xs Add more +
</template>

<style lang="stylus" scoped>

/deep/.q-field__control-container
  padding: 1px !important;

.q-editor__content
    color: red !important;
.rounded-border
  :first-child
    border-radius 15px
</style>
