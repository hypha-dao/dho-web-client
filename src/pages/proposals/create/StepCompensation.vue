<script>
export default {
  name: 'step-compensation',
  props: {
    type: String
  }
}
</script>

<template lang="pug">
.column
  .text-h6 Compensation
  .text-body2 Lorem ipsum and enter the token amounts below

  .row
    .col-12
      .text-h6 HUSD
      q-input(rounded outlined placeholder="HUSD Amount")
    .col-12
      .text-h6 Hypha
      q-input(rounded outlined placeholder="Hypha Amount")
    .col-12
      .text-h6 HVoice
      q-input(rounded outlined placeholder="HVoice Amount")

</template>
