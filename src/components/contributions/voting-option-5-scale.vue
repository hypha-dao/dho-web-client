<script>
export default {
  name: 'voting-option-5-scale',
  data () {
    return {
      group: 'ab',
      options: [
        { value: 'hn', label: '' },
        { value: 'no', label: '' },
        { value: 'ab', label: '' },
        { value: 'ya', label: '' },
        { value: 'hy', label: '' }
      ]
    }
  }
}
</script>

<template lang="pug">
.voting-option-5-scale.q-pa-md.bg-grey-2
  .row.justify-around
    .vote-hy
      q-radio(keep-color v-model="group" val="hy")
      .text-caption.text-center Hell Ya
    .vote-ya
      q-radio(keep-color v-model="group" val="ya")
      .text-caption.text-center Yes
    .vote-ab
      q-radio(keep-color v-model="group" val="ab")
      .text-caption.text-center Abstain
    .vote-no
      q-radio(keep-color v-model="group" val="no")
      .text-caption.text-center No
    .vote-hn
      q-radio(keep-color v-model="group" val="hn")
      .text-caption.text-center Hell No
</template>

<style lang="stylus" scoped>
.voting-option-5-scale

  .vote-hn
    color #E12020
    :first-child
      color #E12020
  .vote-no
    color #FF7170
    :first-child
      color #FF7170
  .vote-ab
    color #F2AC57
    :first-child
      color #F2AC57
  .vote-ya
    color #91D04F
    :first-child
      color #91D04F
  .vote-hy
    color #0FA48B
    :first-child
      color #0FA48B
</style>
