<template>
  <div class="w3-text-theme w3-theme-light p-5">
    <div class="row text-center">
      <div class="col">
        <h2>A Toplista legteteje</h2>
        <table
          class="table table-hover bg-green table-sm my-table-text-sm mx-auto"
          v-if="rows_T.length > 0"
        >
          <thead>
            <tr>
              <th class="w3-theme-d1">Helyezés</th>
              <th
                class="w3-theme-d1"
                v-for="(column, columKey, indexH) in columns_T"
                :key="indexH"
                :class="{ 'd-none': indexH == 0 }"
              >
                {{ column }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, indexR) in rows_T" :key="indexR">
              <td>#{{ indexR + 1 }}</td>
              <td
                v-for="(cell, key, indexD) in row"
                :key="indexD"
                :class="{
                  'd-none': indexD == 0,
                }"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col">
        <h2>A Toplista legalja</h2>
        <table
          class="table table-hover bg-red table-sm my-table-text-sm text-center mx-auto"
          v-if="rows_B.length > 0"
        >
          <thead>
            <tr>
              <th class="w3-theme-d1">Helyezés</th>
              <th
                class="w3-theme-d1"
                v-for="(column, columKey, indexH) in columns_B"
                :key="indexH"
                :class="{ 'd-none': indexH == 0 }"
              >
                {{ column }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, indexR) in rows_B" :key="indexR">
              <td>#{{ indexR + 1 }}</td>
              <td
                v-for="(cell, key, indexD) in row"
                :key="indexD"
                :class="{
                  'd-none': indexD == 0,
                }"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;

export default {
  name: "toplista",
  data() {
    return {
      resData_T: [],
      resData_B: [],
      queryTop: "jatekosokTop",
      queryBottom: "jatekosokBottom",
      title_T: "",
      columns_T: {},
      rows_T: [],
      title_B: "",
      columns_B: {},
      rows_B: [],
    };
  },
  created() {
    this.getTop();
    this.getBottom();
  },
  methods: {
    getTop() {
      axios
        .get(this.url, {
          params: {
            query: this.queryTop,
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.resData_T = res.data;
          this.title_T = this.resData_T.title;
          this.columns_T = this.resData_T.columns;
          this.rows_T = this.resData_T.rows;
          // console.log(this.resData);
        });
    },
    getBottom() {
      axios
        .get(this.url, {
          params: {
            query: this.queryBottom,
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.resData_B = res.data;
          this.title_B = this.resData_B.title;
          this.columns_B = this.resData_B.columns;
          this.rows_B = this.resData_B.rows;
          // console.log(this.resData);
        });
    },
  },
};
</script>

<style>
</style>