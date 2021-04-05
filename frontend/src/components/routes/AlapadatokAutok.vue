<template>
  <div class="p-3">
    <h1>{{title}}</h1>
    <TableRender
      :columns="columns"
      :rows="rows"
      :query="querGet"
			@clickDeleteRow="deleteRow"
      @clickRefresh="getRows()"
      @clickSaverRow="insertUpdateRow"
    ></TableRender>
  </div>
</template>

<script>
const axios = require("axios").default;
import TableRender from "./TableRender.vue";

export default {
  name: "AlapadatokAutok",
  components: { TableRender },
  data() {
    return {
      resData: [],
      querGet: "autokTabla",
      queryUpdate: "autoUpdate",
      queryInsert: "autoInsert",
      queryDelete: "autoDelete",
      title: "",
      columns: {},
      rows: [],
    };
  },
  created() {
    this.getRows();
  },
  methods: {
    getRows() {
      axios
        .get(this.url, {
          params: {
            query: this.querGet,
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.resData = res.data;
          this.title = this.resData.title;
          this.columns = this.resData.columns;
          this.rows = this.resData.rows;
          console.log(this.resData);
        });
    },
    insertUpdateRow(row) {
			let query = this.queryInsert;
      if (row.autoId) {
				query = this.queryUpdate;
			}  
      let params = {
        query: query,
        autoId: row.autoId,
        rendszam: row.rendszam,
        tipus: row.tipus,
        evjarat: row.evjarat,
        szin: row.szin,
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
    deleteRow(row) {
			let query = this.queryDelete;
       console.log(row);
      let params = {
        query: query,
        autoId: row.autoId,
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