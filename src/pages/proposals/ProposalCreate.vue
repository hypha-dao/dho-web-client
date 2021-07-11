<script>
export default {
  name: 'proposal-create',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
  },

  data () {
    return {
      step: 1,
      form: {
        title: '',
        description: '',
        url: ''
      }
    }
  }
}
</script>

<template lang="pug">
.row.justify-center
  q-stepper(v-model="step" animated vertical color="primary")
    q-step(:name="1" title="How you can contribute:" icon="settings" :done="step > 1")
      .text-subtitle1 These are your contribution options:

      widget(title="You have an existing role")
        .q-gutter-md
          q-btn Extend your Role
          .text-body1 If you only want make changes to your commitment level, visit your profile.

      widget(title="Get active in Hypha DHO")
        .q-gutter-md
          q-btn Individual<br>Contribution
          q-btn Apply<br>for a Role
          q-btn Apply<br>for a Badge

      widget(title="On behalf of Hypha DHO")
        .q-gutter-md
          q-btn Create<br>a Role
          q-btn Create<br>a Badge
          q-btn Suspend<br>an Assignment

      q-stepper-navigation
        q-btn(@click="step = 2" color="primary" label="Continue")

    q-step(:name="2" title="Contribution details:" caption="Optional" icon="create_new_folder" :done="step > 2")
      .row
        q-input.col-12(outlined dense ref="title" v-model="form.title" label="Title" maxlength="100")
        q-editor.col-12.q-mt-md(v-model="form.description" min-height="100px")
        fieldset.col-12.q-mt-lg
          legend Supporting documentation
          q-input(outlined dense ref="url" v-model="form.url" label="URL Link")
            template(v-slot:append)
              q-icon(name="fas fa-link" size="xs")

      q-stepper-navigation
        q-btn(@click="step = 3" color="primary" label="Continue")
        q-btn(flat @click="step = 1" color="primary" label="Back" class="q-ml-sm")

    q-step(:name="3" title="Ad template" icon="assignment")
      q-stepper-navigation
          q-btn(@click="step = 4" color="primary" label="Continue")
          q-btn(flat @click="step = 1" color="primary" label="Back" class="q-ml-sm")
</template>
