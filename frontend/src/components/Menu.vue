<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
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
              class="nav-link text-nowrap"
              :class="{ active: this.$route.name == 'profil' }"
              to="/profil/"
            >
              <i class="bi bi-person-circle"></i> {{ loginUserName }}
            </router-link>
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
                <router-link class="dropdown-item" to="/baratok/lista/">
                  Barátaim
                  <i class="bi bi-emoji-sunglasses-fill"></i>
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/baratok/kereses/">
                  Barátok Keresése
                  <i class="bi bi-search"></i>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Toplista -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 1 }">
            <router-link
              class="nav-link text-nowrap"
              :class="{
                active: this.$route.name == 'toplista',
              }"
              to="/toplista/"
            >
              <i class="bi bi-trophy-fill"></i>
              Toplista
            </router-link>
          </li>

          <!-- Játszmáim -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 1 }">
            <router-link
              class="nav-link text-nowrap"
              :class="{
                active: this.$route.name == 'jatszmak',
              }"
              to="/jatszmak/"
            >
              <i class="bi bi-list-stars"></i>
              Játszmáim</router-link
            >
          </li>

          <!-- Játék -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 1 }">
            <router-link
              class="nav-link text-nowrap"
              :class="{
                active: this.$route.name == 'jatek',
              }"
              to="/jatek/"
            >
              <i class="bi bi-joystick"></i>
              Játék</router-link
            >
          </li>
        </ul>

        <ul class="nav navbar-nav ms-auto w-100 justify-content-end">
          <!-- Kijelentkezés -->
          <li
            class="nav-item text-nowrap"
            :class="{ 'd-none': loginAccessLevel < 1 }"
          >
            <button class="nav-link btn btn-white" @click="logout()">
              <i class="bi bi-door-open-fill my-showHover"></i>
              <i class="bi bi-door-closed-fill my-hideHover"></i>
              Kijelentkezés
            </button>
          </li>

          <!-- Bejelentkezés -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 0 }">
            <router-link
              class="nav-link text-nowrap"
              :class="{
                active: this.$route.name == 'bejelentkezes',
              }"
              to="/bejelentkezes/"
            >
              <i class="bi bi-file-lock2-fill"></i>
              Bejelentkezes</router-link
            >
          </li>
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 0 }">
            <router-link
              class="nav-link text-nowrap"
              :class="{
                active: this.$route.name == 'regisztracio',
              }"
              to="/regisztracio/"
            >
              <i class="bi bi-clipboard-check"></i>
              Regisztráció</router-link
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
        }).catch(function (error) {
          // handle error
          // console.log(error);
          this.$router.push({name: "error_500", params: {error: error}});
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
          this.$root.$data.loginProfilePicture = this.resData.loginProfilePicture;
          this.$root.$data.loginEmail = this.resData.loginEmail;

          if (this.$route.name != "bejelentkezes")
            this.$router.push({ name: "bejelentkezes" });
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
        online: 0,
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
button > .my-showHover {
  display: none;
}

button:hover > .my-showHover {
  display: inline-block;
}
button:hover > .my-hideHover {
  display: none;
}
</style>