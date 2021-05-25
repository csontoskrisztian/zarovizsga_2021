<template>
  <div class="w3-text-theme w3-theme-light p-5">
    <div class="mx-auto text-center regisztracio">
      <h2>Regisztráció</h2>
      <form class="needs-validation" novalidate @submit.prevent="onClickRegist">
        <div class="col-sm-4 mx-auto mb-2 has-validation">
          <input
            type="text"
            class="form-control rounded-pill text-center mx-auto"
            id="felhasznalonev"
            aria-describedby="inputGroupPrepend"
            placeholder="Felhasználónév"
            v-model="felhasznalonev"
            required
          />
          <div class="invalid-feedback">A felhasználónév kötelező!</div>
        </div>
        <div class="col-sm-4 mx-auto mb-2 has-validation">
          <input
            type="email"
            class="form-control rounded-pill text-center mx-auto"
            id="email"
            aria-describedby="inputGroupPrepend"
            placeholder="E-mail"
            v-model="email"
            required
          />
          <div class="invalid-feedback">Az email cím kötelező!</div>
        </div>
        <div class="col-sm-4 mx-auto mb-2 has-validation">
          <input
            type="password"
            class="form-control rounded-pill text-center mx-auto"
            id="jelszo"
            aria-describedby="inputGroupPrepend"
            placeholder="Jelszó"
            v-model="jelszo"
            required
          />
          <div class="invalid-feedback">A jelszó kötelező!</div>
        </div>
        <div class="col-sm-4 mx-auto mb-2 has-validation">
          <input
            type="password"
            class="form-control rounded-pill text-center mx-auto"
            id="jelszoE"
            aria-describedby="inputGroupPrepend"
            placeholder="Jelszó Ellenőrzés"
            v-model="jelszoEllenorzes"
            required
          />
          <div class="invalid-feedback">A jelszó ellenőrzése kötelező!</div>
        </div>
        <div class="col-sm-4 mx-auto mb-2">
          <input
            class="form-check-input me-1"
            type="checkbox"
            id="feltelek"
            required
          />
          <label class="form-check-label" for="feltetelek">
            Elfogadom a Felhasználói Feltételeket.
          </label>
          <div class="invalid-feedback">
            A Felhasználói Feltételek elfogadása kötelező!
          </div>
        </div>
        <div class="col-sm-4 mx-auto mb-2">
          <button class="btn btn-primary" type="submit">Regisztráció</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;

export default {
  name: "regisztracio",
  data() {
    return {
      email: null,
      felhasznalonev: null,
      jelszo: null,
      jelszoEllenorzes: null,
      form: null,
      resData: [],
      queryGet: "getUser",
      queryLogin: "loginUser",
      queryOnline: "jatekosOnlineUpdate",
      queryRegist: "jatekosokInsert",
      queryCheckFelhasznalonevEmail: "checkUsernameEmail",
      title: "",
      columns: {},
      rows: [],
    };
  },
  mounted() {
    this.form = document.querySelector(".needs-validation");
  },
  computed: {
    loginId() {
      return this.$root.$data.loginId;
    },
  },
  methods: {
    regist() {
      let params = {
        query: this.queryRegist,
        email: this.email,
        felhasznalonev: this.felhasznalonev,
        jelszo: this.jelszo,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);

          this.login();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    login() {
      axios
        .get(this.url, {
          params: {
            query: this.queryLogin,
            felhasznalonev: this.felhasznalonev,
            jelszo: this.jelszo,
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

          console.log(res.data);

          if (this.$root.$data.loginAccessLevel == 0) {
            alert("Sikertelen bejelentkezés!");
          } else {
            this.setOnline();
          }
        });
    },
    setOnline() {
      let params = {
        query: this.queryOnline,
        id: this.loginId,
        online: 1,
      };
      axios
        .post(this.url, params)
        .then((res) => {
          console.log(res.data);

          this.$router.push({ name: "home" });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    onClickRegist() {
      this.checkUsername();
    },
    checkUsername() {
      axios
        .get(this.url, {
          params: {
            query: this.queryCheckFelhasznalonevEmail,
            felhasznalonev: this.felhasznalonev,
            email: this.email,
          },
        })
        .then((res) => {
          this.handleValidation(res.data.status);
        });
    },
    handleValidation(status) {
      console.log(status);
      if (
        status == "Ok" &&
        this.form.checkValidity() &&
        this.jelszo == this.jelszoEllenorzes
      ) {
        //jó kitöltöttség

        this.regist();
      } else if (status != "Ok") {
        alert("A felhaználónév és/vagy email cím foglalt!");
      } else if (this.jelszo != this.jelszoEllenorzes) {
        alert("A jelszavak nem egyeznek!");
      }

      this.form.classList.add("was-validated");
    },
  },
};
</script>

<style>
.regisztracio input[type="text"], .regisztracio input[type="password"], .regisztracio input[type="email"] {
  border: 2px solid #673ab7 !important;
  width: 75% !important;
  transition: 0.25s !important;
}

.regisztracio input[type="text"]:focus, .regisztracio input[type="password"]:focus, .regisztracio input[type="email"]:focus {
  width: 100% !important;
  border-width: 5px !important;
  border-color: #ffeb3b !important;
}
</style>