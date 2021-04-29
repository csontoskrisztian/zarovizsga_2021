<template>
  <div class="p-5">
    <h2>Regisztráció</h2>
    <form
      class="row g-3 needs-validation"
      novalidate
      @submit.prevent="onClickRegist"
    >
      <div class="col-12">
        <label for="felhasznalonev" class="form-label">Felhasználónév</label>
        <div class="input-group has-validation">
          <input
            type="text"
            class="form-control"
            id="felhasznalonev"
            aria-describedby="inputGroupPrepend"
            v-model="felhasznalonev"
            required
          />
          <div class="invalid-feedback">A felhasználónév kötelező!</div>
        </div>
      </div>
      <div class="col-12">
        <label for="email" class="form-label">Email</label>
        <div class="input-group has-validation">
          <input
            type="email"
            class="form-control"
            id="email"
            aria-describedby="inputGroupPrepend"
            v-model="email"
            required
          />
          <div class="invalid-feedback">Az email cím kötelező!</div>
        </div>
      </div>
      <div class="col-12">
        <label for="jelszo" class="form-label">Jelszó</label>
        <div class="input-group has-validation">
          <input
            type="password"
            class="form-control"
            id="jelszo"
            aria-describedby="inputGroupPrepend"
            v-model="jelszo"
            required
          />
          <div class="invalid-feedback">A jelszó kötelező!</div>
        </div>
      </div>
      <div class="col-12">
        <label for="jelszoE" class="form-label">Jelszó Ellenőrzés</label>
        <div class="input-group has-validation">
          <input
            type="password"
            class="form-control"
            id="jelszoE"
            aria-describedby="inputGroupPrepend"
            v-model="jelszoEllenorzes"
            required
          />
          <div class="invalid-feedback">A jelszó ellenőrzése kötelező!</div>
        </div>
      </div>
      <div class="col-12">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
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
      </div>
      <div class="col-12">
        <button class="btn btn-primary" type="submit">Regisztráció</button>
      </div>
    </form>
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
</style>