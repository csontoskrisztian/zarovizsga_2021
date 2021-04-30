<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <!-- Profil -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 1 }">
            <router-link
              class="nav-link"
              :class="{ active: this.$route.name == 'profil' }"
              to="/profil/"
              >{{ loginUserName }}</router-link
            >
          </li>

          <!-- Barátok -->
          <li
            class="nav-item dropdown"
            :class="{ 'd-none': loginAccessLevel != 1 }"
          >
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Barátok
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <router-link class="dropdown-item" to="/baratok/lista/"
                  >Lista</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" to="/baratok/kereses/"
                  >Keresés</router-link
                >
              </li>
            </ul>
          </li>

          <!-- Toplista -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 1 }">
            <router-link
              class="nav-link"
              :class="{
                active: this.$route.name == 'toplista',
              }"
              to="/toplista/"
              >Toplista</router-link
            >
          </li>

          <!-- Játszmáim -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 1 }">
            <router-link
              class="nav-link"
              :class="{
                active: this.$route.name == 'jatszmaim',
              }"
              to="/jatszmak/"
              >Játszmáim</router-link
            >
          </li>

          <!-- Játék -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 1 }">
            <router-link
              class="nav-link"
              :class="{
                active: this.$route.name == 'jatek',
              }"
              to="/jatek/"
              >Játék</router-link
            >
          </li>
        </ul>

        <ul class="nav navbar-nav ms-auto w-100 justify-content-end">
          <!-- Kijelentkezés -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel < 1 }">
            <button class="nav-link btn btn-white" @click="logout()">
              Kijelentkezés
            </button>
          </li>

          <!-- Bejelentkezés -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 0 }">
            <router-link
              class="nav-link"
              :class="{
                active: this.$route.name == 'bejelentkezes',
              }"
              to="/bejelentkezes/"
              >Bejelentkezes</router-link
            >
          </li>
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 0 }">
            <router-link
              class="nav-link"
              :class="{
                active: this.$route.name == 'regisztracio',
              }"
              to="/regisztracio/"
              >Regisztráció</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
const axios = require("axios").default;
axios.defaults.withCredentials = true;

export default {
  name: "Menu",
  data() {
    return {
      resData: [],
      queryGet: "getUser",
      queryLogout: "logoutUser",
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
          this.$root.$data.loginProfilePicture = this.resData.loginProfilePicture;
          this.$root.$data.loginEmail = this.resData.loginEmail;
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

          this.setOnline();

          this.$root.$data.loginAccessLevel = this.resData.loginAccessLevel;
          this.$root.$data.loginUserName = this.resData.loginUserName;
          this.$root.$data.loginId = this.resData.loginId;

          if (this.$route.name != "bejelentkezes")
            this.$router.push({ name: "bejelentkezes" });
        });
    },
    setOnline() {
      let params = {
        query: this.queryOnline,
        id: this.loginId,
        online: 0,
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