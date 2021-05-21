<template>
  <div class="w3-text-theme container">
    <!-- Végeredmény -->
    <div class="text-center" :class="{ 'd-none': mode != 'Outcome' }">
      <div
        class="p-5 m-5 text-center"
        :class="{
          'bg-warning': vegeredmeny() == 0,
          'bg-success': vegeredmeny() == 1,
          'bg-danger': vegeredmeny() == -1,
        }"
      >
        <div v-if="vegeredmeny() == 0">
          <h1>Döntetlen!</h1>
          <p>Nem nyertél és nem vesztettél pontot!</p>
        </div>
        <div v-if="vegeredmeny() == 1">
          <h1>Nyertél!</h1>
          <p>Szerzett pontok: {{getPontszamok()}}</p>
        </div>
        <div v-if="vegeredmeny() == -1">
          <h1>Vesztettél!</h1>
          <p>Vesztett pontok: {{getPontszamok()}}</p>
        </div>

        <div class="mt-5 d-flex justify-content-around">
          <button class="btn btn-light" @click="mode = 'NewGame'">Új játék!</button>
          <button class="btn btn-light" @click="$router.push({ name: 'home' })">
            Vissza a főmenübe
          </button>
        </div>
      </div>
    </div>
    <!-- Végeredmény -->

    <!-- GAME -->
    <div :class="{ 'd-none': mode != 'Game' }">
      <div class="pt-5 px-5 row">
        <div class="progress rounded col">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated rounded"
            role="progressbar"
            :aria-valuenow="(rows.jatekido / rows.maxido) * 100"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="'width:' + (rows.jatekido / rows.maxido) * 100 + '%'"
          ></div>
        </div>
      </div>
      <div class="d-flex justify-content-center row">
        <div class="col d-flex flex-column text-center justify-content-center">
          <h1>{{ loginId }}</h1>
          <h2>
            {{
              rows.jatekos1_id
                ? rows.jatekos1_id != loginId
                  ? rows.jatekos2_pont
                  : rows.jatekos1_pont
                : "Hiba"
            }}
          </h2>
          <h3>
            {{ rows.kor == this.loginId && gameObject ? gameObject.round : "" }}
          </h3>
        </div>
        <div class="col m-5 d-flex justify-content-center">
          <canvas id="Table" width="400" height="400"></canvas>
        </div>
        <div class="col d-flex flex-column text-center justify-content-center">
          <h1>
            {{
              rows.jatekos1_id
                ? rows.jatekos1_id == loginId
                  ? rows.jatekos2_id
                  : rows.jatekos1_id
                : "Hiba"
            }}
          </h1>
          <h2>
            {{
              rows.jatekos1_id
                ? rows.jatekos1_id == loginId
                  ? rows.jatekos2_pont
                  : rows.jatekos1_pont
                : "Hiba"
            }}
          </h2>
          <h3>
            {{ rows.kor != this.loginId && gameObject ? gameObject.round : "" }}
          </h3>
        </div>
      </div>
    </div>
    <!-- GAME -->

    <!-- Töltő képrenyő -->
    <!-- Míg nincs game object-ünk, de van gameId-ink -->
    <div class="p-5" :class="{ 'd-none': mode != 'Load' }">
      <h2>Várakozás egy ellenfélre ({{ timeoutTime }})</h2>
    </div>
    <!-- Töltő képrenyő -->

    <!-- Játék létrehozás / Csatlakozás -->
    <!-- Eltűnik, ha sikeresen legenráltunk egy új játszmát vagy csatlakozunk egy meglévőhőz -->
    <div
      class="p-5 row d-flex justify-content-between"
      :class="{ 'd-none': mode != 'NewGame' }"
    >
      <!-- Új játék -->
      <div class="col-md-6 col-sm-12 mx-auto">
        <h2>Új játszma indítása</h2>
        <form
          class="px-4 py-3 mb-5 mt-2 border border-dark rounded"
          @submit.prevent="createNewGame"
        >
          <div class="pb-3 row">
            <label for="dropdownFriends" class="form-label col-12 col-sm-6"
              >Ellenfél:
            </label>
            <div class="dropdown col-12 col-sm-6" id="dropdownFriends">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{
                  selectedFriend
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
          <div class="pb-3 row">
            <label for="dropdownMaxtime" class="form-label col-12 col-sm-6"
              >Idő (perc):
            </label>
            <div class="dropdown col-12 col-sm-6" id="dropdownMaxtime">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ selectedTime / 60000 }}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li v-for="row in maxtimeRow" :key="row">
                  <a class="dropdown-item" @click="selectedTime = row">{{
                    row / 60000
                  }}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="pb-3 row">
            <label for="dropdownDifficulty" class="form-label col-12 col-sm-6"
              >Nehézség:
            </label>
            <div class="dropdown col-12 col-sm-6" id="dropdownDifficulty">
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
          <button type="submit" class="btn btn-primary mt-5">
            Játszma indítása!
          </button>
        </form>
      </div>
      <!-- Új játék -->

      <!-- <div class="divider col-md-4 mx-auto"></div> -->

      <!-- Csatlakozás játékhoz -->
      <div class="col-md-6 col-sm-12 mx-auto">
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
    <!-- Játék létrehozás / Csatlakozás -->
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
      queryInsertJatszmaLepesek: "jatszmaLepesekInsert",
      queryGetJatszmaLepesek: "jatszmaLepesekRekordById",
      queryDeleteJatszmaLepesek: "jatszmaLepesekDelete",
      queryGetBaratok: "baratokTabla",
      title: "",
      columns: {},
      rows: [],
      friendsRow: [],
      selectedFriend: null,
      maxtimeRow: [60000, 120000, 180000, 240000, 300000],
      selectedTime: 60000,
      difficultyRow: ["Easy", "Normal", "Hard"],
      selectedDifficulty: 2,
      table: null,
      images: [],
      gameObject: null,
      gameId: null,
      gameSeed: null,
      gameTimer: null,
      timeoutObject: null,
      timeoutTime: 0,
      timeoutGetJatszmaLepesek: null,
      timeGetJatszmaLepesek: 500,
      mode: "NewGame",
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

    // Ha nem a felhasználó köre van, akkor figyelmeztetjük, hogy nem az ő köre van
    this.table.addEventListener("click", () => {
      console.log(this.rows.kor);
      if (this.rows.kor != this.loginId) {
        alert("Nem a te köröd van!");
      }
    });

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
    gameRound() {
      // alert(`${this.rows.kor} köre!`);
      return this.rows.kor;
    },
  },
  methods: {
    testGame() {
      let str = new Date().valueOf().toString();
      this.gameSeed = parseInt(str.substr(str.length - 6));
      this.gameId = 0;
      this.rows = {
        allapot: 1,
        id: this.gameId,
        jatekido: 0,
        maxido: 300000,
        jatekos1_id: this.loginId,
        jatekos2_id: this.loginId,
        jatekos1_pont: 0,
        jatekos2_pont: 0,
        kor: this.loginId,
        seed: this.gameSeed,
        nehezseg: 3,
      };

      this.startGame();
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
            // Megjelnési mód megváltoztatása
            this.mode = "Load";

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
        jatekos2_id:
          this.rows.jatekos1_id == this.loginId
            ? this.rows.jatekos2_id
            : this.loginId,
        jatekos1_pont: this.rows.jatekos1_pont,
        jatekos2_pont: this.rows.jatekos2_pont,
        allapot: this.rows.allapot,
        jatekido: this.rows.maxido,
        kor: this.rows.kor,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);

          // Csak akkor fusson le ha sikerült frissíteni és nincs jatékos2 eltárolva!
          if (res.data.status == "Ok" && !this.rows.jatekos2_id) {
            // Megjelnési mód megváltoztatása
            this.mode = "Game";

            this.rows.jatekos2_id = this.loginId;
            this.rows.jatekido = this.rows.maxido;
            this.startGame();
            this.watchLepesek();
          } else if (!this.rows.jatekos2_id) {
            this.rows = null;
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
        kor: this.loginId,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);

          // Csak akkor fusson le ha sikerült létrehozni!
          if (res.data.rows.id != 0) {
            // Megjelnési mód megváltoztatása
            this.mode = "Load";

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
            }, 500);

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
          if (!this.rows.jatekos2_id && this.timeoutObject != null) {
            setTimeout(this.getJatszmak, 500);
          } else if (this.rows.jatekos2_id) {
            // Visszaszámláló leállítása
            clearInterval(this.timeoutObject);
            this.timeoutObject = null;

            // Megjelnési mód megváltoztatása
            this.mode = "Game";

            // Ha van 2. játékosunk, akkor indítsuk a játékot!
            this.startGame();
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
          // Megjelnési mód megváltoztatása
          this.mode = "NewGame";

          this.gameId = null;
          this.gameSeed = null;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    insertJatszmaLepesek(selected1_X, selected1_Y, selected2_X, selected2_Y) {
      let query = this.queryInsertJatszmaLepesek;
      let params = {
        query: query,
        jatszmakId: this.rows.id,
        jatekosId: this.loginId,
        selected1_X,
        selected1_Y,
        selected2_X,
        selected2_Y,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log("Insert JatszmaLepesek");
          console.log(res.data);
          this.gameObject.OnInsert();
          this.watchLepesek();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    getJatszmaLepesek() {
      axios
        .get(this.url, {
          params: {
            query: this.queryGetJatszmaLepesek,
            jatszmakId: this.gameId,
          },
        })
        .then((res) => {
          if (
            this.gameRound != this.loginId &&
            res.data.rows.length > 0 &&
            this.gameObject.Animations.length == 0 &&
            res.data.rows.jatekosId != this.loginId
          ) {
            console.log("Get JatszmaLepesek");
            console.log(res.data);
            let row = res.data.rows[0];

            this.deleteJatszmaLepesek(row.id);
            this.gameObject.OnOpponentMove(
              row.selected1_X,
              row.selected1_Y,
              row.selected2_X,
              row.selected2_Y
            );
          } else {
            this.watchLepesek();
          }
        });
    },
    deleteJatszmaLepesek(id) {
      let query = this.queryDeleteJatszmaLepesek;
      let params = {
        query: query,
        id: id,
        jatszmakId: this.gameId,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log("Delete JatszmaLepesek");
          console.log(res.data);
          this.watchLepesek();
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
    startGame() {
      // Játék indítás
      this.gameObject = new game.Match3(
        this.table,
        this.images,
        this.rows,
        this.loginId
      );

      // Ha lépünk, akkor azt a lépést egyből vigyük fel a táblába
      this.gameObject.OnPair = this.insertJatszmaLepesek;

      // Ha változik a kör, akkor frissítsük a táblát
      this.gameObject.OnRoundChange = this.updateJatszmak;

      // Időzítő beállítása
      this.gameTimer = setInterval(() => {
        this.rows.jatekido -= 100;

        if (this.rows.jatekido == 0) {
          clearInterval(this.gameTimer);

          this.rows.allapot = 0;
          this.updateJatszmak();
          this.gameObject = null;
          // this.gameId = null;
          this.gameSeed = null;

          // Megjelnési mód megváltoztatása
          this.mode = "Outcome";
        }
      }, 100);
    },
    watchLepesek() {
      if (this.gameRound != this.loginId) {
        // Ha nem a mi körünk van
        // Elindítjuk a folyamatos lépés lekérést
        this.timeoutGetJatszmaLepesek = setTimeout(
          this.getJatszmaLepesek,
          this.timeGetJatszmaLepesek
        );
        // console.log("Elkezdtük az ellenőrzést");
      } else if (this.gameRound == this.loginId) {
        // Megszüntetjuk a folyamatos lépés lekérést
        clearInterval(this.timeoutGetJatszmaLepesek);
        console.log("Megszakítottuk az ellenőrzést");
      }
    },
    vegeredmeny() {
      let jatekos_pont =
        this.rows.jatekos1_id == this.loginId
          ? this.rows.jatekos1_pont
          : this.rows.jatekos2_pont;
      let ellenfel_pont =
        this.rows.jatekos1_id != this.loginId
          ? this.rows.jatekos1_pont
          : this.rows.jatekos2_pont;

      if (jatekos_pont - ellenfel_pont == 0) return 0;
      if (jatekos_pont - ellenfel_pont > 0) return 1;
      if (jatekos_pont - ellenfel_pont < 0) return -1;

      return 0;
    },
    getPontszamok() {
      let jatekos_pont =
        this.rows.jatekos1_id == this.loginId
          ? this.rows.jatekos1_pont
          : this.rows.jatekos2_pont;
      let ellenfel_pont =
        this.rows.jatekos1_id != this.loginId
          ? this.rows.jatekos1_pont
          : this.rows.jatekos2_pont;

      return Math.abs(jatekos_pont - ellenfel_pont);
    }
  },
};
</script>
<style>
.divider {
  border-left: 6px solid black;
}
</style>