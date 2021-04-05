<template>
  <div>
    <select
      :id="id"
      class="form-select"
      v-model="selectedItem"
      @change="onChange"
    >
      <option
        v-for="(listItem, index) in list"
        :key="index"
        :value="listItem[Object.keys(listItem)[0]]"
      >{{listItem[Object.keys(listItem)[1]]}}</option>

    </select>

  </div>
</template>

<script>
export default {
  name: "ComboRender",
  props: ["list", "id","defaultValue"],
  data() {
    return {
      selectedItem: null,
    };
  },
  created(){
    this.selectedItem = this.defaultValue;
  },
  computed: {
    valueActual() {
      return this.defaultValue;
    },
  },
  watch: {
    valueActual() {
      this.selectedItem = this.defaultValue;
    },
  },  
  methods: {
    onChange() {
      //   console.log(this.selectedItem);
      this.$emit("onChangeCombo", this.selectedItem);
    },
  },
};
</script>

<style>
</style>