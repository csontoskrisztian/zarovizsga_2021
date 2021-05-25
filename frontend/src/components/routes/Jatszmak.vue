<template>
  <div class="w3-text-theme w3-theme-light p-5">
    <h1 class="text-center">Játszmáim</h1>
    <div v-if="rows.length == 0">
      <p>
        Még nem játszottál egyszer sem! :c
        <router-link to="/jatek/"
          >Kattints ide hogy elkezdhess egy játékot!</router-link
        >
      </p>
    </div>
    <div class="table-responsive">
      <table
        class="my-table table table-hover table-sm my-table-text-sm mx-auto text-center"
        v-if="rows.length > 0"
      >
        <thead>
          <tr>
            <th
              class="w3-theme-d1"
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
                'bg-red': row['pont'] - row['ellenfel_pont'] < 0,
                'bg-green': row['pont'] - row['ellenfel_pont'] > 0,
                'bg-yellow': row['pont'] - row['ellenfel_pont'] == 0,
              }"
              :data-label="columns[key] + ':'"
            >
              {{
                indexD == 5
                  ? getNehezseg(cell)
                  : indexD == 4
                  ? cell / 60000
                  : cell
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <h3>Jelmagyarázat</h3>
    <span class="bg-green w3-theme-light m-1 p-1">Nyertél</span>
    <span class="bg-red w3-theme-light m-1 p-1">Vesztettél</span>
    <span class="bg-yellow w3-theme-light m-1 p-1">Döntetlen</span>
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
.bg-red {
  background-color: #f98d85 !important;
}

.bg-green {
  background-color: #93cf95 !important;
}

.bg-yellow {
  background-color: #fff38b !important;
}

@media(max-width: 500px){
	.my-table thead{
		display: none;
	}

	.my-table, .my-table tbody, .my-table tr, .my-table td{
		display: block;
		width: 100%;
	}

	.my-table tr{
		margin-bottom:15px;
    border: 3px solid black;
	}

	.my-table td{
		text-align: right;
		padding-left: 50%;
		text-align: right;
		position: relative;
    
	}

	.my-table td::before{
		content: attr(data-label);
		position: absolute;
		left: 0;
		width: 50%;
		padding-left: 5px;
		font-size: 15px;
		font-weight: bold;
		text-align: left;
	}
}
</style>