<template>
  <div>
    <ul
      class="list-group list-group-horizontal"
      v-for="(row, indexR) in rows"
      :key="indexR"
    >
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span class="badge bg-danger rounded-pill" v-if="row.online == 0"
          >offline</span
        >
        <span class="badge bg-success rounded-pill" v-if="row.online == 1"
          >online</span
        >
        <span class="badge bg-warning rounded-pill" v-if="row.online == 2"
          >inGame</span
        >
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center flex-fill"
        v-for="(cell, key, indexD) in row"
        :key="indexD"
        :class="{ 'd-none': indexD < 2 }"
      >
        {{ cell }}
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <button
          type="button"
          class="btn btn-outline-success btn-sm my-p-button"
          :class="{ disabled: row.online == 0 }"
        >
          Meghívom játszani
        </button>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-if="mode == 'list'"
      >
        <button
          type="button"
          class="btn btn-outline-danger btn-sm my-p-button"
          @click="deleteOnclicked(indexR)"
        >
          Barát törlése
        </button>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-if="mode == 'search'"
      >
        <button
          type="button"
          class="btn btn-outline-warning btn-sm my-p-button"
          @click="insertOnclicked(indexR)"
        >
          Hozzáadás barátként
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ListRender",
  props: ["columns", "rows", "query", "mode"],
  methods: {
    deleteOnclicked(index) {
      let answer = window.confirm("Valóabn trölni akarod?");
      if (answer) {
        //törlés
        this.$emit("clickDeleteRow", this.rows[index]);
        this.rows.splice(index, 1);
      }
    },
    insertOnclicked(index) {
      this.$emit("clickInsertRow", this.rows[index]);
      this.rows.splice(index, 1);
    },
  },
};
</script>

<style>
li {
  color: black;
}

.my-insert-button-width {
  width: 55px;
}

.my-p-button {
  padding: 0px 4px;
  margin: 0 3px;
}

.my-table-fit {
  width: 80%;
  white-space: nowrap;
}
.my-table-text-sm {
  font-size: 0.9rem !important;
}

.my-input {
  width: 100%;
  min-width: 60px;
}

.my-td-button {
  padding: 0 !important;
  vertical-align: middle;
}
</style>