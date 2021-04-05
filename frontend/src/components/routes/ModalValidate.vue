<template>
  <div>
    <h1>Modális űrlap</h1>
    <!-- Button trigger modal -->
    <button
      id="buttonModalOpen"
      type="button"
      class="btn btn-primary"
      data-bs-target="#exampleModal"
    >
      Modális űrlap indítása
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              class="modal-title"
              id="exampleModalLabel"
            >Modal title</h5>
            <button
              type="button"
              class="btn-close cancelButton"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">

            <!-- űrlap kezdete -->
            <form
              class="row g-3 needs-validation"
              novalidate
            >
              <div class="col-md-4">
                <label
                  for="validationCustom01"
                  class="form-label"
                >First name</label>
                <input
                  type="text"
                  class="form-control"
                  id="validationCustom01"
                  value=""
                  required
                >
                <div class="valid-feedback">
                  Jól van kitöltve!
                </div>
                <div class="invalid-feedback">
                  Kötelező a user név.
                </div>
              </div>
            </form>

            <!-- űrlap vége -->

          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary cancelButton"
            >Mégse</button>
            <button
              id="saveButton"
              type="button"
              class="btn btn-primary"
            >Mentés</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const bootstrap = require("bootstrap");
export default {
  name: "ModalValidate",
  data() {
    return {
      myModal: null,
      form: null,
    };
  },
  mounted() {
    //exampleModal
    this.myModal = new bootstrap.Modal(
      document.getElementById("exampleModal"),
      {
        keyboard: false,
      }
    );
    let buttonModalOpen = document.getElementById("buttonModalOpen");
    buttonModalOpen.addEventListener("click", this.formOpen);

    let saveButton = document.getElementById("saveButton");
    let cancelButtons = document.querySelectorAll(".cancelButton");

    saveButton.addEventListener("click", this.formSave);

    cancelButtons.forEach((cancelButton) => {
      cancelButton.addEventListener("click", this.formCancel);
    });

    this.form = document.querySelector(".needs-validation");

    //egyből indítja az űrlapot
    // this.formOpen();
  },
  methods: {
    formOpen() {
      this.myModal.show();
    },
    formCancel() {
      console.log("formCancel");
      this.myModal.hide();
    },
    formSave() {
      console.log("formSave");
      this.form.classList.add("was-validated");

      if (this.form.checkValidity()) {
        this.myModal.hide();
      } else {
        return;
      }

    },
  },
};
</script>

<style>
</style>