<template>
  <div class="w3-text-theme p-5">
    <h1>Játszmáim</h1>
    <div v-if="rows.length == 0">
      <p>
        Még nem játszottál egyszer sem! :c
        <router-link to="/jatek/">Kattints ide hogy elkezdhess egy játékot!</router-link>
        </p>
    </div>
    <table class="table my-table-fit table-sm my-table-text-sm" v-if="rows.length > 0">
      <thead class="table-dark">
        <tr>
          <th
            v-for="(column, columKey, indexH) in columns"
            :key="indexH"
            :class="{ 'd-none': indexH == 0 }"
          >
            {{ column }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, indexR) in rows" :key="indexR">
          <td
            v-for="(cell, key, indexD) in row"
            :key="indexD"
            :class="{
              'd-none': indexD == 0,
              'bg-danger': row['pont'] - row['ellenfel_pont'] < 0,
              'bg-success': row['pont'] - row['ellenfel_pont'] > 0,
              'bg-warning': row['pont'] - row['ellenfel_pont'] == 0,
            }"
          >
            {{ indexD == 5 ? getNehezseg(cell) : indexD == 4 ? cell / 60000 : cell }}
          </td>
        </tr>
      </tbody>
    </table>
    <br>
    <h3>Jelmagyarázat</h3>
    <span class="bg-success m-1 p-1">Nyertél</span>
    <span class="bg-danger m-1 p-1">Vesztettél</span>
    <span class="bg-warning m-1 p-1">Döntetlen</span>
  </div>
</template>

<script>
const axios = require("axios").default;

export default {
  name: "Játszmák",
  data() {
    return {
      resData: [],
      queryGet: "jatszmak10RekordById",
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
    getNehezseg(nehezseg) {
      return nehezseg == 1 ? "Künnyű" : nehezseg == 2 ? "Normál" : "Nehéz";
    },
  },
};
</script>

<style>
</style>