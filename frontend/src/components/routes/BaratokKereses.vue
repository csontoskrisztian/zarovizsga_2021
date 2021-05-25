<template>
  <div class="w3-text-theme w3-theme-light p-5">
    <h1 class="text-center">Barátok Keresése</h1>
    <nav class="navbar bg-yellow sticky-top w-100 w-sm-50 mx-auto rounded-bottom">
      <div class="container-fluid">
        <form class="d-flex mx-auto" @submit.prevent="jatekosSearch()">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Felhasználónév"
            aria-label="Felhasználónév"
            v-model="kereses"
          />
          <button class="btn btn-outline-yellow" type="submit"><i class="bi bi-search"></i></button>
        </form>
      </div>
    </nav>
    <br />
    <ListRender
      :mode="'search'"
      :columns="columns"
      :rows="rows"
      :query="querySearch"
      @clickInsertRow="insertRow"
    ></ListRender>
  </div>
</template>

<script>
const axios = require("axios").default;
import ListRender from "./ListRender.vue";

export default {
  name: "baratokKereses",
  components: { ListRender },
  data() {
    return {
      resData: [],
      querySearch: "jatekosSearch",
      queryInsert: "baratokInsert",
      title: "",
      columns: {},
      rows: [],
      kereses: "",
    };
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
    }
  },
  methods: {
    jatekosSearch() {
      axios
        .get(this.url, {
          params: {
            query: this.querySearch,
            felhasznalonev: this.kereses,
            id: this.loginId,
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

          // console.log(res.data);
        });
    },
    insertRow(row) {
      let query = this.queryInsert;
      console.log(row);
      let params = {
        query: query,
        jatekos1_id: this.loginId,
        jatekos2_id: row.id,
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
.bg-yellow {
  background-color: #fff38b;
}

.btn-outline-yellow {
  border: 1px solid black;
  background-color: #ffeb3b;
}

.btn-outline-yellow:hover {
  background-color: #9e8e00;
  color: #ffeb3b;
  border: 1px solid #ffeb3b;
}

@media (min-width: 576px) {
  .w-sm-50 {
    width: 50% !important;
  }
}
</style>