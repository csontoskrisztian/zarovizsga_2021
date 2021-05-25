<template>
  <div class="p-5 w3-theme-d3">
    <router-link
      to="/"
      class="header-font text-decoration-none bubblefont fst-italic"
      > Match3! </router-link
    >
  </div>
</template>

<script>
export default {
  name: "Head",
};
</script>

<style>
.header-font {
  font-size: calc(2vw + 4vh + 2vmin);
}
</style>