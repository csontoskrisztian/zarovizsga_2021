<template>
  <div class="w3-text-theme p-5">
    <img src="../../assets/logo.png" alt="" />
    <div class="profile">
      <h2>{{ loginUserName }}</h2>
      <p v-for="(column, key, index) in columns" :key="index">
        {{ column }}: {{ rows[index][key] }} pont
      </p>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;

export default {
  name: "profil",
  data() {
    return {
      resData: [],
      queryGet: "jatekosPontszam",
      title: "",
      columns: {},
      rows: [],
    };
  },
  created() {
    this.getUser();
  },
  computed: {
    loginAccessLevel() {
      return this.$root.$data.loginAccessLevel;
    },
    loginUserName() {
      return this.$root.$data.loginUserName;
    },
    loginId() {
      return this.$root.$data.loginId;
    },
  },
  methods: {
    getUser() {
      axios
        .get(this.url, {
          params: {
            query: this.queryGet,
          },
        })
        .then((res) => {
          this.resData = res.data;
          this.title = this.resData.title;
          this.columns = this.resData.columns;
          this.rows = this.resData.rows;

          this.$root.$data.loginAccessLevel = this.resData.loginAccessLevel;
          this.$root.$data.loginUserName = this.resData.loginUserName;
          this.$root.$data.loginId = this.resData.loginId;

          this.getRows();
        });
    },
    getRows() {
      axios
        .get(this.url, {
          params: {
            query: this.queryGet,
            id: this.loginId,
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.resData = res.data;
          this.title = this.resData.title;
          this.columns = this.resData.columns;
          this.rows = this.resData.rows;
          // console.log(this.resData);
        });
    },
  },
};
</script>

<style>
.profile {
  display: inline-block;
}
</style>