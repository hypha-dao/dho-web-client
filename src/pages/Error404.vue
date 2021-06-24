<script>
export default {
  name: 'page-error404',

  meta: {
    title: '404'
  }
}
</script>

<template lang="pug">
  .fixed-center.text-center
    p
      img(
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      )
    p.text-faded Sorry, nothing here...<strong>(404)</strong>
    q-btn(
      color="secondary"
      style="width:200px;"
      @click="$router.go(-1)"
      label="Go back"
    )
</template>
