<template>
  <div class="w3-text-theme w3-theme-light p-5">
    <!-- Végeredmény -->
    <div class="w-md-75 mx-auto" :class="{ 'd-none': mode != 'Outcome' }">
      <div
        class="py-3 text-center w3-theme container rounded-3 border border-2 border-dark"
        :class="{
          'bg-warning': vegeredmeny() == 0,
          'bg-success': vegeredmeny() == 1,
          'bg-danger': vegeredmeny() == -1,
        }"
      >
        <div class="row-auto" v-if="vegeredmeny() == 0">
          <h1>Döntetlen!</h1>
          <p>Nem nyertél és nem vesztettél pontot!</p>
        </div>
        <div class="row-auto" v-if="vegeredmeny() == 1">
          <h1>Nyertél!</h1>
          <p>Szerzett pontok: {{ getPontszamok() }}</p>
        </div>
        <div class="row-auto" v-if="vegeredmeny() == -1">
          <h1>Vesztettél!</h1>
          <p>Vesztett pontok: {{ getPontszamok() }}</p>
        </div>

        <div class="my-3 row justify-content-center">
          <div class="col-auto mb-2">
            <button class="btn btn-light" @click="mode = 'NewGame'">
              Új játék!
            </button>
          </div>
          <div class="col-auto">
            <button
              class="btn btn-light"
              @click="$router.push({ name: 'home' })"
            >
              Vissza a főmenübe
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Végeredmény -->

    <!-- GAME -->
    <div :class="{ 'd-none': mode != 'Game' }">
      <div class="pb-5 px-5 row">
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
        <div
          class="col-12 col-md-4 order-2 order-sm-1 mb-5 d-flex flex-column text-center justify-content-center"
        >
          <h1 class="w3-theme rounded-top mb-0">{{ loginUserName }}</h1>
          <h2 class="w3-theme mb-0">
            {{
              rows.jatekos1_id
                ? rows.jatekos1_id != loginId
                  ? rows.jatekos2_pont
                  : rows.jatekos1_pont
                : "Hiba"
            }}
            pont
          </h2>
          <h3 v-if="gameObject" class="w3-theme rounded-bottom mb-0 py-2">
            <i
              v-if="gameObject.round == 2 && rows.kor == this.loginId"
              class="bi bi-circle-fill"
            ></i>
            <i
              v-if="gameObject.round == 1 && rows.kor == this.loginId"
              class="bi bi-circle-half"
            ></i>
            <i
              v-if="gameObject.round == 0 || rows.kor != this.loginId"
              class="bi bi-circle"
            ></i>
          </h3>
        </div>
        <div
          class="col-12 col-md-4 order-1 order-sm-2 mb-5 d-flex justify-content-center"
        >
          <canvas id="Table" width="300" height="300"></canvas>
        </div>
        <div
          class="col-12 col-md-4 order-3 order-sm-3 mb-2 d-flex flex-column text-center justify-content-center"
        >
          <h1 class="w3-theme rounded-top mb-0">
            {{ opponentUsername }}
          </h1>
          <h2 class="w3-theme mb-0">
            {{
              rows.jatekos1_id
                ? rows.jatekos1_id == loginId
                  ? rows.jatekos2_pont
                  : rows.jatekos1_pont
                : "Hiba"
            }}
            pont
          </h2>
          <h3 v-if="gameObject" class="w3-theme rounded-bottom mb-0 py-2">
            <i
              v-if="gameObject.round == 2 && rows.kor != this.loginId"
              class="bi bi-circle-fill"
            ></i>
            <i
              v-if="gameObject.round == 1 && rows.kor != this.loginId"
              class="bi bi-circle-half"
            ></i>
            <i
              v-if="gameObject.round == 0 || rows.kor == this.loginId"
              class="bi bi-circle"
            ></i>
          </h3>
        </div>
      </div>
    </div>
    <!-- GAME -->

    <!-- Töltő képrenyő -->
    <!-- Míg nincs game object-ünk, de van gameId-ink -->
    <div class="p-5 text-center" :class="{ 'd-none': mode != 'Load' }">
      <h2>Várakozás egy ellenfélre ({{ timeoutTime }})</h2>
      <div
        class="spinner-border mt-3"
        style="width: 5rem; height: 5rem"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <!-- Töltő képrenyő -->

    <!-- Játék létrehozás / Csatlakozás -->
    <!-- Eltűnik, ha sikeresen legenráltunk egy új játszmát vagy csatlakozunk egy meglévőhőz -->
    <div class="container pt-3" :class="{ 'd-none': mode != 'NewGame' }">
      <div class="row text-center">
        <div
          class="col mb-5 py-3 me-1 bg-yellow rounded-3 border border-2 border-dark"
        >
          <!-- Új játék -->
          <h2 class="mb-4 border-bottom border-dark border-2">
            Új játszma indítása
          </h2>
          <div class="mx-auto">
            <form class="mt-2 px-md-5" @submit.prevent="createNewGame">
              <div class="pb-3 mb-2 d-flex justify-content-between">
                <label for="dropdownFriends" class="form-label mt-1">
                  <i class="bi bi-person-square"></i>
                  Ellenfél:
                </label>
                <div class="dropdown d-inline-block" id="dropdownFriends">
                  <button
                    class="btn btn-purple dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{
                      selectedFriend
                        ? friendsRow.find((x) => x.id == selectedFriend)
                            .felhasznalonev
                        : "Véletlen Játékos"
                    }}
                  </button>
                  <ul
                    class="dropdown-menu dropdown-menu-end bg-purple-light"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li v-for="(row, indexR) in friendsRow" :key="indexR">
                      <a
                        class="dropdown-item"
                        v-for="(cell, key, indexD) in row"
                        :key="indexD"
                        :class="{
                          'd-none': indexD < 2,
                          disabled: true,
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
                        Véletlen Játékos
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="pb-3 mb-2 text-start d-flex justify-content-between">
                <label for="dropdownMaxtime" class="form-label mt-1 text-left">
                  <i class="bi bi-stopwatch"></i>
                  Idő:
                </label>
                <div class="dropdown d-inline-block" id="dropdownMaxtime">
                  <button
                    class="btn btn-purple dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ selectedTime / 60000 }} perc
                  </button>
                  <ul
                    class="dropdown-menu dropdown-menu-end bg-purple-light"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li v-for="row in maxtimeRow" :key="row">
                      <a class="dropdown-item" @click="selectedTime = row"
                        >{{ row / 60000 }} perc</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
              <div class="pb-3 d-flex justify-content-between">
                <label for="dropdownDifficulty" class="form-label mt-1">
                  <i class="bi bi-reception-3"></i>
                  Nehézség:
                </label>
                <div class="dropdown d-inline-block" id="dropdownDifficulty">
                  <button
                    class="btn btn-purple dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ difficultyRow[selectedDifficulty - 1] }}
                  </button>
                  <ul
                    class="dropdown-menu dropdown-menu-end bg-purple-light"
                    aria-labelledby="dropdownMenuButton1"
                  >
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
              <button type="submit" class="btn btn-purple mt-3">
                Játszma indítása!
                <i class="bi bi-play-fill"></i>
              </button>
            </form>
          </div>
          <!-- Új játék -->
        </div>
        <div
          class="col mb-5 py-3 ms-1 bg-yellow rounded-3 border border-2 border-dark"
        >
          <!-- Csatlakozás játékhoz -->
          <h2 class="mb-4 border-bottom border-dark border-2">
            Csatlakozás meglévő játékhoz
          </h2>
          <div class="mx-auto text-center">
            <button
              type="button"
              class="btn btn-purple mx-4 my-3"
              @click.prevent="findGame"
            >
              Játszma Keresés!
              <i class="bi bi-search"></i>
            </button>
          </div>
          <!-- Csatlakozás játékhoz -->
        </div>
      </div>
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
      queryGetFelhasznalonev: "jatekosFelhasznalonevById",
      title: "",
      columns: {},
      rows: [],
      friendsRow: [],
      opponentUsername: "",
      selectedFriend: null,
      maxtimeRow: [60000, 180000, 300000],
      selectedTime: 60000,
      difficultyRow: ["Künnyű", "Normál", "Nehéz"],
      selectedDifficulty: 2,
      table: null,
      images: [],
      gameObject: null,
      gameId: null,
      gameSeed: null,
      gameTimer: null,
      gameTimerKeses: 0,
      timeoutObject: null,
      timeoutTime: 0,
      timeoutGetJatszmaLepesek: null,
      timeGetJatszmaLepesek: 500,
      mode: "NewGame",
      test: false,
    };
  },
  created() {
    let forrasok = [
      // require("@/assets/game_tiles/Apple.png"),
      // require("@/assets/game_tiles/Avocado.png"),
      // require("@/assets/game_tiles/Banana.png"),
      // require("@/assets/game_tiles/Blackberry.png"),
      // require("@/assets/game_tiles/Cherry.png"),
      // require("@/assets/game_tiles/Coconut.png"),
      // require("@/assets/game_tiles/Fig.png"),
      // require("@/assets/game_tiles/Grapes.png"),
      // require("@/assets/game_tiles/Kiwi.png"),
      // require("@/assets/game_tiles/Lemon.png"),
      // require("@/assets/game_tiles/Mango.png"),
    ];
    for (let i = 1; i < 11; i++) {
      forrasok.push(require("@/assets/game_tiles/tile_" + i + ".png"));
    }
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
      console.log(this.rows);
      if (this.rows.kor != this.loginId && !this.test) {
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
      this.mode = "Game";
      this.gameId = 1;
      this.test = true;

      console.log(this.rows);

      this.getJatszmak();
    },
    findGame() {
      if (this.test) return;
      console.log("Finding Game!");

      this.findJatszmak();
    },
    createNewGame() {
      if (this.test) return;
      console.log("New game!");

      // A random szám generátor nem bír el túl nagy seed-et, szóval le kell vágni egy részét :I
      // Csak a mostani idő milliszekundum részét hadjuk meg
      let str = new Date().valueOf().toString();
      this.gameSeed = parseInt(str.substr(str.length - 6));
      // console.log(`seed: ${this.gameSeed}`);

      this.insertJatszmak();
    },
    findJatszmak() {
      if (this.test) return;
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
      if (this.test) return;
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
            this.getUsername();
            this.startGame();
            this.watchLepesek();
          } else if (!this.rows.jatekos2_id) {
            // this.rows = null;
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
      if (this.test) return;
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

          if (this.test) {
            this.getUsername();
            this.rows.allapot = 1;
            this.rows.kor = 1;
            this.rows.seed = 123456;
            this.startGame();
          }
          if (this.test) return;

          // Ha a jatekos2_id = null, akkor újra kérdezzük, míg más eredményt nem kapunk
          if (!this.rows.jatekos2_id && this.timeoutObject != null) {
            this.gameTimerKeses += 100;
            setTimeout(this.getJatszmak, 100);
          } else if (this.rows.jatekos2_id) {
            // Visszaszámláló leállítása
            clearInterval(this.timeoutObject);
            this.timeoutObject = null;

            this.rows.jatekido -= this.gameTimerKeses;
            this.rows.maxido -= this.gameTimerKeses;

            this.getUsername();

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
      if (this.test) return;
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
      if (this.test) return;
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
      if (this.test) return;
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
      if (this.test) return;
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
    getUsername() {
      console.log("getUsername");
      console.log(
        this.rows.jatekos1_id == this.loginId
          ? this.rows.jatekos2_id
          : this.rows.jatekos1_id
      );
      axios
        .get(this.url, {
          params: {
            query: this.queryGetFelhasznalonev,
            id:
              this.rows.jatekos1_id == this.loginId
                ? this.rows.jatekos2_id
                : this.rows.jatekos1_id,
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.resData = res.data;
          this.title = this.resData.title;
          this.opponentUsername = res.data.rows[0].felhasznalonev;
          // console.log(this.resData);
        });
    },
    startGame() {
      // console.log(this.rows);
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

        if (this.rows.jatekido <= 0) {
          clearInterval(this.gameTimer);

          this.rows.allapot = 0;
          this.updateJatszmak();
          // for (const prop in this.gameObject) {
          //   this.gameObject[prop] = null;
          // }

          this.gameObject.Destroy();
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
    },
  },
};
</script>
<style>
.bg-purple-light {
  background-color: #e0d6f2 !important;
}

.btn-purple {
  background-color: #5d34a4 !important;
  color: #f6f3fb !important;
}

.btn-purple:hover {
  background-color: #845bcb !important;
  color: #f6f3fb !important;
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .w-md-75 {
    width: 75% !important;
  }
}
</style>