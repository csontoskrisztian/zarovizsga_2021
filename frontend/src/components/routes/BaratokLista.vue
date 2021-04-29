<template>
  <div class="w3-text-theme p-5">
    <h1>{{ title }}</h1>
    <br />
    <div v-if="rows.length == 0">
      <p>
        Sajnos nincsenek barátaid! :c
        <router-link to="/baratok/kereses/">Kattints ide barátok kereséséhez!</router-link>
        </p>
    </div>
    <ListRender
      v-if="rows.length > 0"
      :mode="'list'"
      :columns="columns"
      :rows="rows"
      :query="queryGet"
      @clickDeleteRow="deleteRow"
    ></ListRender>
  </div>
</template>

<script>
const axios = require("axios").default;
import ListRender from "./ListRender.vue";

export default {
  name: "baratokLista",
  components: { ListRender },
  data() {
    return {
      resData: [],
      queryGet: "baratokTabla",
      queryDelete: "baratokDelete",
      title: "",
      columns: {},
      rows: [],
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
    },
  },
  created() {
    this.getUser();
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
    deleteRow(row) {
      let query = this.queryDelete;
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
</style>