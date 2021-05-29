<template>
  <div class="w3-text-theme w3-theme-light p-5">
    <div class="mx-auto text-center bejelentkezes">
      <h2>Bejelentkezés</h2>
      <form @submit.prevent="login">
        <div class="col-sm-4 mx-auto mb-2">
          <input
            type="text"
            class="form-control rounded-pill text-center mx-auto"
            id="felhasznalonevInput"
            placeholder="Felhasználónév"
            v-model="felhasznalonev"
          />
        </div>
        <div class="col-sm-4 mx-auto">
          <input
            type="password"
            class="form-control rounded-pill text-center mx-auto"
            id="jelszoInput"
            placeholder="Jelszó"
            v-model="jelszo"
          />
        </div>
        <small id="jelszoHelp" class="form-text text-muted"
          >Ne oszd meg senkivel sem a jelszavad!</small
        >
        <br />
        <button type="submit" class="mt-3 btn btn-primary">
          Bejelentkezés
        </button>
      </form>
    </div>
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
        }).catch(function (error) {
          // handle error
          // console.log(error);
          this.$router.push({name: "error_500", params: {error: error}});
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
        }).catch(function (error) {
          // handle error
          // console.log(error);
          this.$router.push({name: "error_500", params: {error: error}});
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
          // console.log(error);
          this.$router.push({name: "error_500", params: {error: error}});
        });
    },
  },
};
</script>

<style>
.bejelentkezes input[type="text"], .bejelentkezes input[type="password"], .bejelentkezes input[type="email"] {
  border: 2px solid #673ab7 !important;
  width: 75% !important;
  transition: 0.25s !important;
}

.bejelentkezes input[type="text"]:focus, .bejelentkezes input[type="password"]:focus, .bejelentkezes input[type="email"]:focus {
  width: 100% !important;
  border-width: 5px !important;
  border-color: #ffeb3b !important;
}
</style>