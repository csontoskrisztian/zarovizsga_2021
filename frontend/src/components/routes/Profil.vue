<template>
  <div class="w3-text-theme p-5">
    <img :src="getProfilePicture" alt="">
    <!-- <img src="@/assets/profile_pictures/logo.png"/> -->
    <div class="profile">
      <h1>{{ loginUserName }}</h1>
      <h3>{{ loginEmail }}</h3>
      <p v-for="(column, key, index) in columns" :key="index">
        {{ column }}: {{ rows.length > 0 ? rows[index][key] : 0 }} pont
      </p>
    </div>

    <!-- Button trigger modal -->
    <button
      type="button"
      class="btn btn-primary ms-5"
      data-bs-toggle="modal"
      data-bs-target="#editModal"
      @click="onClickShowModal"
    >
      Profil szerkesztése
    </button>
    <button
      type="button"
      class="btn btn-danger ms-5"
      data-bs-toggle="modal"
      data-bs-target="#deleteModal"
    >
      Profil törlése
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Profil szerkesztése</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="row needs-validation" novalidate>
              <div class="row p-2">
                <label for="felhasznalonev" class="col-5 col-form-label"
                  >Új Felhasználónév:</label
                >
                <div class="col-5">
                  <input
                    type="text"
                    class="form-control"
                    id="felhasznalonev"
                    v-model="ujfelhasznalonev"
                  />
                </div>
              </div>
              <div class="row p-2">
                <label for="jelszo" class="col-5 col-form-label"
                  >Új Jelszó:</label
                >
                <div class="col-5">
                  <input
                    type="text"
                    class="form-control"
                    id="jelszo"
                    v-model="ujjelszo"
                  />
                </div>
              </div>

              <hr class="my-2" />

              <div class="row p-2">
                <label for="jJelszo" class="col-5 col-form-label"
                  >Jelenlegi Jelszó:</label
                >
                <div class="col-5">
                  <input
                    type="password"
                    class="form-control"
                    id="jJelszo"
                    v-model="jelenlegiJelszo"
                    required
                  />
                  <div class="alert alert-danger invalid-feedback">
                    Kérlek add meg a jelenlegi jelszavadat!
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Mégse
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click.prevent="onClickSave"
            >
              Változtatások mentése
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Profil törlése</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
const bootstrap = require("bootstrap");

export default {
  name: "profil",
  data() {
    return {
      resData: [],
      queryGet: "jatekosPontszam",
      queryUpdateFelhasznalonev: "jatekosFelhasznalonevUpdate",
      queryUpdateJelszo: "jatekosJelszoUpdate",
      queryCheckJelszo: "checkPassword",
      title: "",
      columns: {},
      rows: [],
      form: null,
      editModal: null,
      deleteModal: null,
      ujfelhasznalonev: "",
      ujjelszo: "",
      jelenlegiJelszo: "",
    };
  },
  created() {
    this.getUser();
  },
  mounted() {
    // console.log("mounted");
    this.form = document.querySelector(".needs-validation");
    this.editModal = new bootstrap.Modal(document.getElementById("editModal"));
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
    loginProfilePicture() {
      return this.$root.$data.loginProfilePicture;
    },
    loginEmail() {
      return this.$root.$data.loginEmail;
    },
    getProfilePicture() {
      return this.loginProfilePicture ? require('@/assets/profile_pictures/' + this.loginProfilePicture) : '';
    }
  },
  methods: {
    onClickShowModal() {
      this.form.classList.remove("was-validated");
      this.ujfelhasznalonev = "";
      this.ujjelszo = "";
      this.jelenlegiJelszo = "";
    },
    onClickSave() {
      this.checkPassword();
    },
    handleValidation(status) {
      if (status == "Ok" && this.form.checkValidity()) {
        //jó kitöltöttség
        this.form.classList.add("was-validated");
        let jJelszo = document.querySelector("#jJelszo");
        jJelszo.classList.add("is-valid");

        if (this.ujfelhasznalonev != "") this.updateFelhasznalonev();
        if (this.ujjelszo != "") this.updateJelszo();

        this.getUser();

        this.editModal.hide();
      } else {
        console.log("Helytelen jelszó");
        let jJelszo = document.querySelector("#jJelszo");
        jJelszo.classList.add("is-invalid");
      }
    },
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
          this.$root.$data.loginProfilePicture = this.resData.loginProfilePicture;
          this.$root.$data.loginEmail = this.resData.loginEmail;

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
    updateFelhasznalonev() {
      let params = {
        query: this.queryUpdateFelhasznalonev,
        felhasznalonev: this.ujfelhasznalonev,
        id: this.loginId,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);
          this.$root.$data.loginUserName = this.ujfelhasznalonev;
          // this.getUser();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    updateJelszo() {
      let params = {
        query: this.queryUpdateJelszo,
        jelszo: this.ujjelszo,
        id: this.loginId,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);
          this.getUser();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    checkPassword() {
      axios
        .get(this.url, {
          params: {
            query: this.queryCheckJelszo,
            id: this.loginId,
            jelszo: this.jelenlegiJelszo,
          },
        })
        .then((res) => {
          this.handleValidation(res.data.status);
        });
    },
  },
};
</script>

<style>
.profile {
  display: inline-block;
  color: black;
}
</style>