<template>
  <div class="w3-text-theme w3-theme-light p-5">
    <div>
      <div class="profilepicture-wrapper position-relative">
        <img
          :src="getProfilePicture()"
          alt="Profilkép"
          title="Profilkép"
          class="img-fluid rounded-circle border border-5 border-theme mx-auto d-block profilepicture"
        />
        <!-- <img src="@/assets/profile_pictures/logo.png"/> -->
      </div>
      <div class="text-center">
        <h1 class="fw-bold fst-italic display-2">{{ loginUserName }}</h1>
        <p class="display-6">
          {{ columns.pont }}: {{ rows ? rows.pont : 0 }} pont
        </p>
      </div>
    </div>
    <div class="mx-auto text-center">
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-warning me-1 mb-1"
        data-bs-toggle="modal"
        data-bs-target="#editModal"
        @click="onClickShowModalEdit"
      >
        <i class="bi bi-pencil-square"></i>
        Profil szerkesztése
      </button>
      <button
        type="button"
        class="btn btn-danger ms-1 mb-1"
        data-bs-toggle="modal"
        data-bs-target="#deleteModal"
        @click="onClickShowModalDelete"
      >
        <i class="bi bi-trash-fill"></i>
        Profil törlése
      </button>
    </div>

    <!-- Modal -->
    <!-- Profil szerkesztése -->
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
            <form class="container needs-validation mx-auto" novalidate>
              <div class="row p-2">
                <label for="felhasznalonev" class="col-5 col-form-label"
                  >Új Felhasználónév:</label
                >
                <div class="col-7">
                  <input
                    type="text"
                    class="form-control"
                    id="felhasznalonev"
                    v-model="ujfelhasznalonev"
                  />
                </div>
              </div>
              <div class="row p-2">
                <label for="email+" class="col-5 col-form-label"
                  >Új Email cím:</label
                >
                <div class="col-7">
                  <input
                    type="text"
                    class="form-control"
                    id="email"
                    v-model="ujemail"
                  />
                </div>
              </div>
              <div class="row p-2">
                <label for="jelszo" class="col-5 col-form-label"
                  >Új Jelszó:</label
                >
                <div class="col-7">
                  <input
                    type="password"
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
                <div class="col-7">
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
              class="btn btn-secondary text-nowrap"
              data-bs-dismiss="modal"
            >
              <i class="bi bi-x-circle"></i>
              Mégse
            </button>
            <button
              type="button"
              class="btn btn-purple text-nowrap"
              @click.prevent="onClickSave"
            >
              <i class="bi bi-save me-1"></i>
              Változtatások mentése
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Profil törlése -->
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
          <div class="modal-body">
            <div class="row p-2">
              <label for="jJelszoDelete" class="col-5 col-form-label"
                >Jelenlegi Jelszó:</label
              >
              <div class="col-7">
                <input
                  type="password"
                  class="form-control"
                  id="jJelszoDelete"
                  v-model="jelenlegiJelszo"
                  required
                />
                <div class="alert alert-danger invalid-feedback">
                  Kérlek add meg a jelenlegi jelszavadat!
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary text-nowrap"
              data-bs-dismiss="modal"
            >
              <i class="bi bi-x-circle"></i>
              Mégse
            </button>
            <button
              type="button"
              class="btn btn-danger text-nowrap"
              @click.prevent="onClickDelete"
            >
              Profil törlése
            </button>
          </div>
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
      queryJatekosUpdate: "jatekosUpdate",
      queryJatekosDelete: "jatekosTorlesUpdate",
      queryUpdateJelszo: "jatekosJelszoUpdate",
      queryCheckJelszo: "checkPassword",
      queryLogout: "logoutUser",
      queryOnline: "jatekosOnlineUpdate",
      title: "",
      columns: {},
      rows: [],
      form: null,
      editModal: null,
      deleteModal: null,
      modalMode: "",
      ujfelhasznalonev: "",
      ujemail: "",
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
    this.deleteModal = new bootstrap.Modal(
      document.getElementById("deleteModal")
    );
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
  },
  methods: {
    onClickShowModalEdit() {
      this.form.classList.remove("was-validated");
      let jJelszo = document.querySelector("#jJelszo");
      jJelszo.classList.remove("is-valid");
      jJelszo.classList.remove("is-invalid");
      this.ujfelhasznalonev = this.loginUserName;
      this.ujemail = this.loginEmail;
      this.ujjelszo = "";
      this.jelenlegiJelszo = "";

      this.modalMode = "edit";
    },
    onClickShowModalDelete() {
      this.form.classList.remove("was-validated");
      let jJelszo = document.querySelector("#jJelszoDelete");
      jJelszo.classList.remove("is-valid");
      jJelszo.classList.remove("is-invalid");
      this.jelenlegiJelszo = "";

      this.modalMode = "delete";
    },
    onClickSave() {
      this.checkPassword();
    },
    onClickDelete() {
      this.checkPassword();
    },
    handleValidation(status) {
      if (status == "Ok" && this.form.checkValidity()) {
        if (this.modalMode == "edit") {
          //jó kitöltöttség
          this.form.classList.add("was-validated");
          let jJelszo = document.querySelector("#jJelszo");
          jJelszo.classList.remove("is-invalid");
          jJelszo.classList.add("is-valid");
          this.updateJatekos();
          if (this.ujjelszo != "") this.updateJelszo();

          this.getUser();

          this.editModal.hide();
        } else if (this.modalMode == "delete") {
          //jó kitöltöttség
          this.form.classList.add("was-validated");
          let jJelszo = document.querySelector("#jJelszoDelete");
          jJelszo.classList.remove("is-invalid");
          jJelszo.classList.add("is-valid");

          if (confirm("Biztos, hogy törölni akarod a profilodat?")) {
            this.deleteJatekos();
          }

          this.deleteModal.hide();
        }
      } else {
        console.log("Helytelen jelszó");
        if (this.modalMode == "edit") {
          let jJelszo = document.querySelector("#jJelszo");
          jJelszo.classList.add("is-invalid");
        } else if (this.modalMode == "delete") {
          let jJelszo = document.querySelector("#jJelszoDelete");
          jJelszo.classList.add("is-invalid");
        }
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

          this.ujfelhasznalonev = this.loginUserName;
          this.ujemail = this.loginEmail;

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
          this.rows = this.resData.rows[0];
          // console.log(this.resData);
        });
    },
    updateJatekos() {
      let params = {
        query: this.queryJatekosUpdate,
        felhasznalonev: this.ujfelhasznalonev,
        email: this.ujemail,
        id: this.loginId,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);
          this.getUser();
          // this.getUser();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    deleteJatekos() {
      let params = {
        query: this.queryJatekosDelete,
        id: this.loginId,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);

          this.setOnline();
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
    getProfilePicture() {
      return this.loginProfilePicture
        ? require("@/assets/profile_pictures/" + this.loginProfilePicture)
        : "";
    },
    logout() {
      axios
        .get(this.url, {
          params: {
            query: this.queryLogout,
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

          if (this.$route.name != "bejelentkezes")
            this.$router.push({ name: "bejelentkezes" });
        });
    },
    setOnline() {
      let params = {
        query: this.queryOnline,
        id: this.loginId,
        online: 0,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);
          this.logout();
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
.border-theme {
  border-color: #673ab7 !important;
}

.profilepicture-wrapper {
  object-fit: cover;
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .profilepicture {
    object-fit: cover;
    width: 100px;
    height: 100px;
  }
}

/* Large devices (desktops, 992px and up) */
@media (max-width: 992px) {
  .profilepicture {
    /* max-width: 25%; */
    object-fit: cover;
    width: 200px;
    height: 200px;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .profilepicture {
    /* max-width: 25%; */
    object-fit: cover;
    width: 300px;
    height: 300px;
  }
}
</style>