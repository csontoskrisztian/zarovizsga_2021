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
              class="nav-link active"
              aria-current="page"
              to="/profil/"
              >{{loginUserName}}</router-link
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

          <!-- Játszmáim -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 1 }">
            <router-link class="nav-link" to="/jatszmak/">Játszmáim</router-link>
          </li>

          <!-- Játék -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 1 }">
            <router-link class="nav-link" to="/jatek/">Játék</router-link>
          </li>
        </ul>

        <ul class="nav navbar-nav ms-auto w-100 justify-content-end">
          <!-- Kijelentkezés -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel < 1 }">
            <a class="nav-link" @click="logout()">Kijelentkezés</a>
          </li>

          <!-- Bejelentkezés -->
          <li class="nav-item" :class="{ 'd-none': loginAccessLevel != 0 }">
            <router-link class="nav-link" to="/bejelentkezes/"
              >Bejelentkezes</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
const axios = require("axios").default;

export default {
  name: "Menu",
  data() {
    return {
      resData: [],
      queryGet: "getUser",
      queryLogout: "logoutUser",
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
    }
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

          this.$root.$data.loginAccessLevel = this.resData.loginAccessLevel;
          this.$root.$data.loginUserName = this.resData.loginUserName;
          this.$root.$data.loginId = this.resData.loginId;

          if (this.$router.history.current.path != "/") this.$router.push("/");
        });
    },
  },
};
</script>

<style>
</style>