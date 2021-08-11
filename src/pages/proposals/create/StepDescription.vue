<script>
export default {
  name: 'step-description',
  props: {
    type: String
  }
}
</script>

<template lang="pug">
.column
  .row
    .col-6
      .text-h6 Title
      q-input(rounded outlined placeholder="Title")
    .col-6
      .text-h6 Objective
      q-input(rounded outlined placeholder="Objective")
  .text-h6 Key Results
  q-input(rounded outlined placeholder="Key Result")
  .text-h6 Description
  q-input(rounded outlined placeholder="Description")
  .text-h6 URL Attachment
  q-input(rounded outlined placeholder="Attachment")

</template>
