<template>
  <div class="p-3">
    <button @click="getUser()">Get user</button>
    <button @click="login()">Login</button>
    <button @click="logout()">Logout</button>
  </div>
</template>

<script>
const axios = require("axios").default;

export default {
  name: "Test",
  data() {
    return {
      resData: [],
      queryGet: "getUser",
      queryLogin: "loginUser",
      queryLogout: "logoutUser",
      title: "",
      columns: {},
      rows: [],
    };
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
          console.log(this.resData);
        });
    },
    login() {
      axios
        .get(this.url, {
          params: {
            query: this.queryLogin,
            felhasznalonev: "teszt1",
            jelszo: "jelszo",
          },
        })
        .then((res) => {
          this.resData = res.data;
          this.title = this.resData.title;
          this.columns = this.resData.columns;
          this.rows = this.resData.rows;
          console.log(this.resData);
        });
    },
    logout() {
      axios
        .get(this.url, {
          params: {
            query: this.queryLogout,
          },
        })
        .then((res) => {
          this.resData = res.data;
          this.title = this.resData.title;
          this.columns = this.resData.columns;
          this.rows = this.resData.rows;
          console.log(this.resData);
        });
    },
  },
};
</script>

<style>
</style>