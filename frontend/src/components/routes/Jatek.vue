<template>
  <div class="w3-text-theme d-flex justify-content-center">
    <canvas class="m-5" id="Table" width="400" height="400"></canvas>
  </div>
</template>

<script>
const axios = require("axios").default;
const game = require("match3");

export default {
  name: "jatek",
  data() {
    return {
      resData: [],
      queryGet: "jatszmaTabla",
      title: "",
      columns: {},
      rows: [],
      gameObject: null,
      table: null,
      images: [],
    };
  },
  created() {
    let forrasok = [
      require("@/assets/game_tiles/Apple.png"),
      require("@/assets/game_tiles/Avocado.png"),
      require("@/assets/game_tiles/Banana.png"),
      require("@/assets/game_tiles/Blackberry.png"),
      require("@/assets/game_tiles/Cherry.png"),
      require("@/assets/game_tiles/Coconut.png"),
      require("@/assets/game_tiles/Fig.png"),
      require("@/assets/game_tiles/Grapes.png"),
      require("@/assets/game_tiles/Kiwi.png"),
    ];
    for (let i = 0; i < forrasok.length; i++) {
      let kep = new Image();
      kep.src = forrasok[i];
      this.images.push(kep);
    }
  },
  mounted() {
    this.table = document.getElementById("Table");
    this.getJatszma();
  },
  methods: {
    getJatszma() {
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

          this.gameObject = new game.Match3(this.table, this.rows, this.images);
        });
    },
  },
};
</script>

<style>
</style>