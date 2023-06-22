<script>
export default {
  name: 'quick-actions'
}
</script>

<template lang="pug">
.quick-actions.full-width.q-px-lg
  .row
    .text-h6.text-bold {{ $t('navigation.quick-actions.quickActions') }}
  .row.items-center.q-my-lg
    q-btn.q-mr-md(rounded="rounded" unelevated="unelevated" color="primary" icon="far fa-file-alt" padding="12px" size="sm")
    .text-body2
      .text-bold {{ $t('navigation.quick-actions.completeDraft') }}
      .text-body {{ $t('navigation.quick-actions.youHaveA') }}
  .row.items-center.q-my-lg
    q-btn.q-mr-md(rounded="rounded" unelevated="unelevated" color="primary" icon="far fa-calendar-alt" padding="12px" size="sm")
      q-badge(floating="floating" rounded="rounded" color="red" :label="$t('navigation.quick-actions.7432')")
    .text-body2
      .text-bold {{ $t('navigation.quick-actions.claimPeriods') }}
      .text-body {{ $t('navigation.quick-actions.youHave') }}
  .row.items-center.q-my-lg
    q-btn.q-mr-md(rounded="rounded" unelevated="unelevated" color="primary" icon="fas fa-sliders-h" padding="12px" size="sm")
    .text-body2
      .text-bold {{ $t('navigation.quick-actions.adjustCommitment') }}
      .text-body.text-ellipsis {{ $t('navigation.quick-actions.forASpecific') }}
  .row.items-center.q-mt-lg
    q-btn.q-mr-md(disable="disable" unelevated="unelevated" rounded="rounded" color="internal-bg" text-color="grey-7" icon="far fa-clock" padding="12px" size="sm")
    .text-body2
      .text-bold {{ $t('navigation.quick-actions.extendAssignment') }}
      .text-body {{ $t('navigation.quick-actions.extendYourAssignment') }}

</template>
