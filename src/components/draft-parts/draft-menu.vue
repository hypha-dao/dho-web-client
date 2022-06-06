<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'draft-menu',
  props: {
    draft: { type: Object, required: true },
    type: { type: String, required: true }
  },
  methods: {
    ...mapActions('profiles', ['deleteDraft']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    editDraft () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: `${this.type}Form`,
        data: this.draft
      })
    }
  }
}
</script>

<template lang="pug">
q-btn.card-menu(
  icon="fas fa-ellipsis-v"
  color="grey"
  flat
  dense
  round
  no-caps
  :ripple="false"
  style="width:40px;height:40px;margin: 4px;"
)
  q-menu
    q-list(dense)
      q-item(
        clickable
        v-close-popup
        @click="editDraft"
      )
        q-item-section(style="max-width: 20px;")
          q-icon(name="fas fa-pencil-alt" size="14px")
        q-item-section Edit
      q-item(
        clickable
      )
        q-popup-proxy
          .confirm.column.q-pa-sm
            | Are you sure you want to delete this draft?
            .row.flex.justify-between.q-mt-sm
              q-btn(
                color="primary"
                label="No"
                dense
                flat
                v-close-popup="-1"
              )
              q-btn(
                color="primary"
                label="Yes"
                dense
                @click="deleteDraft(draft.id)"
                v-close-popup="-1"
              )
        q-item-section(style="max-width: 20px;")
          q-icon(name="fas fa-trash-alt" size="14px")
        q-item-section Delete
</template>

<style lang="stylus" scoped>
.card-menu
  position absolute
  right 0
  top 7px
  width 20px
  z-index 110
  /deep/.q-focus-helper
    display none !important
</style>
