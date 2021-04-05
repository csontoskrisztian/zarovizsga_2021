<template>
  <div>

    <h1>Kölcsönzés</h1>
    <div class="table-responsive">

      <table class="table table-striped my-table-fit table-sm">
        <thead class="table-dark">
          <tr>
            <!-- vezérlők -->
            <th class="my-insert-button-width my-td-button">

              <!-- frissítés -->
              <!-- Látható: mindíg -->
              <button
                type="button"
                class="btn btn-outline-light btn-sm my-p-button"
                @click="rowsRefresh()"
              >
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>

              <!-- insert: sor Hozzáfűzés -> insert  -->
              <!-- Látható: read -->
              <button
                type="button"
                class="btn btn-success btn-sm my-p-button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                @click="insertOnclicked()"
              >
                <i class="bi bi-plus"></i>
              </button>

            </th>

            <th
              v-for="(th, thKey, indexH) in columnsKolcsonzesOsszes"
              :key="indexH"
            >
              {{th}}
            </th>

          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, indexR) in rowsKolcsonzesOsszes"
            :key="indexR"
          >
            <!-- Vezérlők -->
            <td class="my-td-button">
              <!-- update: adatmódosítás üzemmódba lépés: -> update  -->
              <button
                type="button"
                class="btn btn-outline-warning btn-sm my-p-button"
                @click="updateOnclicked(indexR)"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <i class="bi bi-pencil-fill "></i>
              </button>

              <!-- Delete Törlés: ->  -->
              <button
                type="button"
                class="btn btn-outline-danger btn-sm my-p-button"
                @click="deleteOnclicked(indexR)"
              >
                <i class="bi bi-x"></i>
              </button>
            </td>

            <td
              v-for="(cell, cellKey, indexTd) in row"
              :key="indexTd"
            >
              {{cell}}
            </td>

          </tr>

        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <form class="needs-validation"
					
				>
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="exampleModalLabel"
              >Kölcsönzés</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="cancelOnClicked"
              ></button>
            </div>
            <div class="modal-body">
              <h1>{{statusTitle}}</h1>

              <!-- Bérlet kezdete, Napok száma, Napidíj -->
              <div class="row mb-3">
                <div class="col-5">
                  <label
                    for="berletKezdete"
                    class="form-label"
                  >Bérlet kezdete</label>
                  <input
                    v-model="rowBuffer.berletKezdete"
                    type="date"
                    class="form-control"
                    id="berletKezdete"
                    required
                  >
                  <div class="invalid-feedback">
                    A helyes formátumú dátum kötelező.
                  </div>
                </div>

                <div
                  class="col-3"
                  v-if="status=='update'"
                >
                  <label
                    for="napokSzama"
                    class="form-label"
                  >Napok száma</label>
                  <input
                    v-model="rowBuffer.napokSzama"
                    type="number"
                    class="form-control"
                    id="napokSzama"
                  >

                </div>

                <div class="col-4">
                  <label
                    for="napidij"
                    class="form-label"
                  >Napidíj</label>
                  <input
                    v-model="rowBuffer.napidij"
                    type="number"
                    class="form-control"
                    id="napidij"
                    required
                  >
                  <div class="invalid-feedback">
                    A napidíj kötelező.
                  </div>
                </div>

              </div>
              <div class="row">
                <div class="col-6">
                  <label
                    for="berlo"
                    class="form-label"
                  >Bérlő</label>
                  <ComboRender
                    :id="'berlo'"
                    :list="listBerlok"
                    :defaultValue="rowBuffer.berloId"
                    @onChangeCombo="onChangeBerlok"
                  ></ComboRender>
                </div>
                <div class="col-6">
                  <label
                    for="auto"
                    class="form-label"
                  >Autó</label>
                  <ComboRender
                    :id="'auto'"
                    :list="listAutokRendszam"
                    :defaultValue="rowBuffer.autoId"
                    @onChangeCombo="onChangeKolcsonzottAtuto"
                  ></ComboRender>
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="cancelOnClicked"
              >Mégse</button>
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                @click.stop.prevent="postKolcsonzes"
              >Mentés</button>
            </div>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import ComboRender from "./ComboRender.vue";
const axios = require("axios").default;

export default {
  components: { ComboRender },
  name: "Kolcsonzes",
  data() {
    return {
        resData: [],
      listBerlok: [],
      listAutokRendszam: [],
      rowsKolcsonzesOsszes: [],
      columnsKolcsonzesOsszes: [],
      status: "read",
      statusTitle: null,
      selectedRowIndex: null,
      rowBuffer: null,
    };
  },
  created() {
    this.getCommboAutoList();
    this.getCommboBerloList();
    this.getKolcsonzes();
    this.rowBuffer = this.getRowNull();
  },
  methods: {
    getRowNull() {
      let row = { ...this.rowsKolcsonzesOsszes[0] };
      for (const key in row) {
        row[key] = null;
      }
      // console.log("rowBuffer:", this.rowsKolcsonzesOsszes);
      return row;
    },
    deleteKolcsonzes() {
      let answer = window.confirm("Valóban törölni akarja?");
      if (answer) {
        let params = {
          query: "kolcsonzesDelete",
          kolcsonzesId: this.rowsKolcsonzesOsszes[this.selectedRowIndex]
            .kolcsonzesId,
        };
        axios
          .post(this.url, params)
          .then((res) => {
            console.log(res.data);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(() => {
            this.getKolcsonzes();
            this.status = "read";
          });
      }
    },
    postKolcsonzes() {
      console.log("postKolcsonzes");
      let query = "kolcsonzesInsert";
      if (this.rowBuffer.kolcsonzesId) {
        query = "kolcsonzesUpdate";
      }
      let params = {
        query: query,
        kolcsonzesId: this.rowBuffer.kolcsonzesId,
        berloId: this.rowBuffer.berloId,
        autoId: this.rowBuffer.autoId,
        berletKezdete: this.rowBuffer.berletKezdete,
        napokSzama: this.rowBuffer.napokSzama,
        napidij: this.rowBuffer.napidij,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(() => {
          this.getKolcsonzes();
          this.status = "read";
        });
    },

    getKolcsonzes() {
      axios
        .get(this.url, {
          params: {
            query: "kolcsonzesOsszes",
          },
        })
        .then((res) => {
          this.rowsKolcsonzesOsszes = res.data.rows;
          this.columnsKolcsonzesOsszes = res.data.columns;
          // console.log(this.rowsKolcsonzesOsszes);
          this.rowBuffer = this.getRowNull();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    getCommboAutoList() {
      let query =
        this.status == "update"
          ? "autokRendszam"
          : "autokRendszamKolcsonozheto";
      axios
        .get(this.url, {
          params: {
            query: query,
          },
        })
        .then((res) => {
          this.resData = res.data;
          this.listAutokRendszam = this.resData.rows;
          // console.log(this.listAutokRendszamKolcsonozheto);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    getCommboBerloList() {
      axios
        .get(this.url, {
          params: {
            query: "berlokAbc",
          },
        })
        .then((res) => {
          this.resData = res.data;
          this.listBerlok = this.resData.rows;
          // console.log(this.listBerlok);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    onChangeKolcsonzottAtuto(id) {
      console.log("AutoId:", id);
      this.rowBuffer.autoId = id;
    },
    onChangeBerlok(id) {
      console.log("BerloId:", id);
      this.rowBuffer.berloId = id;
    },
    insertOnclicked() {
      this.status = "insert";
      this.statusTitle = "Új bérlés";
      this.rowBuffer = this.getRowNull();
      this.getCommboAutoList();
    },
    updateOnclicked(index) {
      this.selectedRowIndex = index;
      this.status = "update";
      this.statusTitle = "Módosítás";
      this.getCommboAutoList();
      this.rowBuffer = { ...this.rowsKolcsonzesOsszes[this.selectedRowIndex] };
      // this.rowBuffer = this.rowsKolcsonzesOsszes[this.selectedRowIndex];
    },
    cancelOnClicked() {
      this.status = "read";
    },
    deleteOnclicked(index) {
      this.selectedRowIndex = index;
      this.status = "delete";
      this.deleteKolcsonzes();
    },
    rowsRefresh() {
      this.getKolcsonzes();
    },
  },
};
</script>

<style>
</style>