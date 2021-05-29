<template>
  <div class="w3-text-theme w3-theme-light p-5">
      <h1>Hiba történt!</h1>
      <p>{{error}}</p>
  </div>
</template>

<script>
export default {
    name: "error_500",
    props: ['error']
}
</script>

<style>

</style>