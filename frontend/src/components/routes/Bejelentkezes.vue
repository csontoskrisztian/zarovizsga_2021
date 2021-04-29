<template>
  <div class="p-5">
    <h2>Bejelentkezés</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="felhasznalonevInput">Felhasználónév</label>
        <input
          type="text"
          class="form-control"
          id="felhasznalonevInput"
          placeholder="Felhasználónév"
          v-model="felhasznalonev"
        />
      </div>
      <div class="form-group">
        <label for="jelszoInput">Jelszó</label>
        <input
          type="password"
          class="form-control"
          id="jelszoInput"
          placeholder="Jelszó"
          v-model="jelszo"
        />
      </div>
      <small id="jelszoHelp" class="form-text text-muted"
        >Ne oszd meg senkivel sem a jelszavad!</small
      >
      <!-- <div class="form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div> -->
      <br />
      <button type="submit" class="mt-5 btn btn-primary">Bejelentkezés</button>
    </form>
  </div>
</template>

<script>
const axios = require("axios").default;
axios.defaults.withCredentials = true;

export default {
  name: "bejelentkezes",
  data() {
    return {
      felhasznalonev: null,
      jelszo: null,
      resData: [],
      queryGet: "getUser",
      queryLogin: "loginUser",
      queryOnline: "jatekosOnlineUpdate",
      title: "",
      columns: {},
      rows: [],
    };
  },
  created() {
    this.getUser();
  },
  computed: {
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
          this.$root.$data.loginProfilePicture = this.resData.loginProfilePicture;
          this.$root.$data.loginEmail = this.resData.loginEmail;
        });
    },
    login() {
      axios
        .get(this.url, {
          params: {
            query: this.queryLogin,
            felhasznalonev: this.felhasznalonev,
            jelszo: this.jelszo,
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
          this.$root.$data.loginProfilePicture = this.resData.loginProfilePicture;
          this.$root.$data.loginEmail = this.resData.loginEmail;

          console.log(res.data);

          if (this.$root.$data.loginAccessLevel == 0) {
            alert("Helytelen felhasználónév vagy jelszó!");
          } else {
            this.setOnline();

            this.$router.push({ name: "home" });
          }
        });
    },
    setOnline() {
      let params = {
        query: this.queryOnline,
        id: this.loginId,
        online: 1,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>