<template>
  <div class="w3-text-theme">
    <!-- GAME -->
    <div
      class="d-flex justify-content-center"
      :class="{ 'd-none': gameObject == null }"
    >
      <canvas class="m-5" id="Table" width="400" height="400"></canvas>
    </div>
    <!-- GAME -->

    <!-- Töltő képrenyő -->
    <!-- Míg nincs game object-ünk, de van gameId-ink -->
    <div
      class="p-5"
      :class="{ 'd-none': gameId == null || gameObject != null }"
    >
      <h2>Várakozás egy ellenfélre ({{ timeoutTime }})</h2>
    </div>
    <!-- Töltő képrenyő -->

    <!-- Eltűnik, ha sikeresen legenráltunk egy új játszmát vagy csatlakoztunk egy meglévőhőz -->
    <div
      class="p-5 d-flex f-row justify-content-center"
      :class="{ 'd-none': gameId != null }"
    >
      <!-- Új játék -->
      <div class="p-5 w-50">
        <h2>Új játszma indítása</h2>
        <form class="px-4 py-3 mx-4 my-3" @submit.prevent="createNewGame">
          <div class="p-3 border border-dark rounded">
            <div class="mb-3 row">
              <label for="dropdownFriends" class="form-label col"
                >Ellenfél:
              </label>
              <div class="dropdown col" id="dropdownFriends">
                <button
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{
                    selectedFriend != -1
                      ? friendsRow.find((x) => x.id == selectedFriend)
                          .felhasznalonev
                      : "Random Player"
                  }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li v-for="(row, indexR) in friendsRow" :key="indexR">
                    <a
                      class="dropdown-item"
                      v-for="(cell, key, indexD) in row"
                      :key="indexD"
                      :class="{
                        'd-none': indexD < 2,
                        disabled: row.online == 0,
                      }"
                      @click="selectedFriend = row.id"
                      >{{ cell }}</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="#"
                      @click="selectedFriend = -1"
                    >
                      Random Player
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="mb-3 row">
              <label for="dropdownMaxtime" class="form-label col"
                >Idő (perc):
              </label>
              <div class="dropdown col" id="dropdownMaxtime">
                <button
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ selectedTime / 1000 / 60 }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li v-for="row in maxtimeRow" :key="row">
                    <a class="dropdown-item" @click="selectedTime = row">{{
                      row / 1000 / 60
                    }}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="mb-3 row">
              <label for="dropdownDifficulty" class="form-label col"
                >Nehézség:
              </label>
              <div class="dropdown col" id="dropdownDifficulty">
                <button
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ difficultyRow[selectedDifficulty - 1] }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li v-for="(row, index) in difficultyRow" :key="index">
                    <a
                      class="dropdown-item"
                      @click="selectedDifficulty = index + 1"
                      >{{ row }}</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-5">
            Játszma indítása!
          </button>
        </form>
      </div>
      <!-- Új játék -->

      <div class="divider"></div>

      <!-- Csatlakozás játékhoz -->
      <div class="p-5 w-50">
        <h2>Csatlakozás meglévő játékhoz</h2>
        <button
          type="button"
          class="btn btn-primary mx-4 my-3"
          @click.prevent="findGame"
        >
          Játszma Keresés!
        </button>
      </div>
      <!-- Csatlakozás játékhoz -->
    </div>
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
      queryGetUser: "getUser",
      queryGetJatszmak: "jatszmakRekordById",
      queryFindJatszmak: "jatszmakRekordByAllapot",
      queryInsertJatszmak: "jatszmakInsert",
      queryUpdateJatszmak: "jatszmakUpdate",
      queryDeleteJatszmak: "jatszmakDelete",
      queryGetBaratok: "baratokTabla",
      title: "",
      columns: {},
      rows: [],
      friendsRow: [],
      selectedFriend: -1,
      maxtimeRow: [300000, 600000, 900000, 1200000],
      selectedTime: 300000,
      difficultyRow: ["Easy", "Normal", "Hard"],
      selectedDifficulty: 2,
      table: null,
      images: [],
      gameObject: null,
      gameId: null,
      gameSeed: null,
      timeoutObject: null,
      timeoutTime: 0,
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
      require("@/assets/game_tiles/Lemon.png"),
      require("@/assets/game_tiles/Mango.png"),
    ];
    // for (let i = 1; i < 11; i++) {
    //     forrasok.push(require("@/assets/game_tiles/tile_"+i+".png"));
    // }
    for (let i = 0; i < forrasok.length; i++) {
      let kep = new Image();
      kep.src = forrasok[i];
      this.images.push(kep);
    }

    this.getUser();
  },
  mounted() {
    this.table = document.getElementById("Table");
    // this.testGame();
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
    testGame() {
      let str = new Date().valueOf().toString();
      this.gameSeed = parseInt(str.substr(str.length - 6));
      this.gameId = 0;

      this.gameObject = new game.Match3(this.table, this.images, this.gameSeed, 3);
    },
    findGame() {
      console.log("Finding Game!");

      this.findJatszmak();
    },
    createNewGame() {
      console.log("New game!");

      // A random szám generátor nem bír el túl nagy seed-et, szóval le kell vágni egy részét :I
      // Csak a mostani idő milliszekundum részét hadjuk meg
      let str = new Date().valueOf().toString();
      this.gameSeed = parseInt(str.substr(str.length - 6));
      // console.log(`seed: ${this.gameSeed}`);

      this.insertJatszmak();
    },
    findJatszmak() {
      // console.log(this.gameId);
      axios
        .get(this.url, {
          params: {
            query: this.queryFindJatszmak,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.resData = res.data;
          this.title = this.resData.title;
          this.columns = this.resData.columns;
          this.rows = this.resData.rows[0];

          if (this.rows.length == 0) {
            alert("Nem találtunk futó játékot! Kérjük próbáld meg később!");
          } else {
            this.gameId = this.rows.id;
            this.gameSeed = this.rows.seed;

            // Frissítsük a rekordot, így jelezve, hogy csatlakoztunk a játékhoz
            this.updateJatszmak();
          }
        });
    },
    updateJatszmak() {
      let query = this.queryUpdateJatszmak;
      let params = {
        query: query,
        id: this.rows.id,
        jatekos2_id: this.loginId,
        jatekos1_pont: this.rows.jatekos1_pont,
        jatekos2_pont: this.rows.jatekos2_pont,
        allapot: this.rows.allapot,
        jatekido: this.rows.jatekido,
        kor: this.rows.kor,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);

          // Csak akkor fusson le ha sikerült frissíteni!
          if (res.data.status == "Ok") {
            // Játék indítás
            this.gameObject = new game.Match3(
              this.table,
              this.images,
              this.gameSeed
            );
          } else {
            this.gameId = null;
            this.gameSeed = null;

            alert("Nem sikerült csatlakozni a játékhoz!");
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    insertJatszmak() {
      let query = this.queryInsertJatszmak;
      let params = {
        query: query,
        jatekos1_id: this.loginId,
        jatekos2_id: this.selectedFriend,
        maxido: this.selectedTime,
        nehezseg: this.selectedDifficulty,
        seed: this.gameSeed,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);

          // Csak akkor fusson le ha sikerült létrehozni!
          if (res.data.rows.id != 0) {
            // Eltároljuk a játékunk id-jét
            this.gameId = res.data.rows.id;

            // Időzítő elindítása
            this.timeoutTime = 60;
            this.timeoutObject = setInterval(() => {
              if (this.timeoutTime > 0) {
                this.timeoutTime -= 1;
              } else {
                clearInterval(this.timeoutObject);
                this.timeoutObject = null;
              }
            }, 1000);

            // Lekérjük a játszmánk adatait
            this.getJatszmak();
          } else {
            alert(
              "Nem sikerült létrehozni a játékot! Kérjük próbáld meg később!"
            );
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    getJatszmak() {
      // console.log(this.gameId);
      axios
        .get(this.url, {
          params: {
            query: this.queryGetJatszmak,
            id: this.gameId,
          },
        })
        .then((res) => {
          this.resData = res.data;
          this.title = this.resData.title;
          this.columns = this.resData.columns;
          this.rows = this.resData.rows[0];

          // Ha a jatekos2_id = null, akkor újra kérdezzük, míg más eredményt nem kapunk
          if (this.rows.jatekos2_id == null && this.timeoutObject != null) {
            setTimeout(this.getJatszmak, 500);
          } else if (this.rows.jatekos2_id != null) {
            // Visszaszámláló leállítása
            clearInterval(this.timeoutObject);
            this.timeoutObject = null;

            // Ha van 2. játékosunk, akkor indítsuk a játékot!
            this.gameObject = new game.Match3(
              this.table,
              this.images,
              this.gameSeed
            );

            // Kor frissítés
          } else {
            // Játék törlése
            this.deleteJatszmak();

            alert(
              "Nem csatlakozott senki a játékodhoz! Kérjük próbáld meg később!"
            );
          }
        });
    },
    deleteJatszmak() {
      let query = this.queryDeleteJatszmak;
      let params = {
        query: query,
        id: this.gameId,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);
          this.gameId = null;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    getUser() {
      axios
        .get(this.url, {
          params: {
            query: this.queryGetUser,
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

          this.getFriends();
        });
    },
    getFriends() {
      axios
        .get(this.url, {
          params: {
            query: this.queryGetBaratok,
            id: this.loginId,
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.resData = res.data;
          this.title = this.resData.title;
          this.friendsRow = res.data.rows;
          // console.log(this.resData);
        });
    },
  },
};
</script>
<style>
.divider {
  border-left: 6px solid black;
}
</style>