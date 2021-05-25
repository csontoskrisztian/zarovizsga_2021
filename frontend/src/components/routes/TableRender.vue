<template>
  <div>
    <table class="table table-striped my-table-fit table-sm my-table-text-sm">
      <thead class="table-dark">
        <tr>
          <!-- Fejléc -->
          <th
            v-for="(column, columKey, indexH) in columns"
            :key="indexH"
            :class="{ 'my-hide': indexH == 0 }"
          >
            {{column}}
          </th>
          <th class="my-insert-button-width my-td-button">
            <!-- Frissítés -->
            <!-- Látható: mindíg -->
            <button
              type="button"
              class="btn btn-outline-light btn-sm my-p-button"
              @click="rowsRefresh()"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
            </button>

            <!-- insert: Új sor beszúrása: -> insert -->
            <!-- Látható: read -->
            <button
              type="button"
              class="btn btn-outline-success btn-sm my-p-button"
              @click="insertOnclicked()"
              v-if="status=='read'"
            >
              <i class="bi bi-plus"></i>
            </button>

          </th>
        </tr>
      </thead>

      <tbody>
        <!-- sorok -->
        <tr
          v-for="(row, indexR) in rows"
          :key="indexR"
          @dblclick="updateOnclicked(indexR)"
        >
          <!-- Adatoszlopok -->
          <td
            v-for="(cell, key, indexD) in row"
            :key="indexD"
            :class="{ 'my-hide': indexD == 0 }"
          >
            <!-- látvány, tartalom -->
            <span v-if="status=='read' || indexR!=selectedRowIndex">
              {{cell}}
            </span>

            <!-- adatmódosítás -->
            <div>
              <input
                class="my-input"
                type="text"
                v-model="row[key]"
                v-if="(status=='update' || status=='insert') && indexR==selectedRowIndex"
              >
            </div>

          </td>

          <!-- kezelő gombok -->
          <td class="my-td-button">
            <!-- update: adatmódosítás üzemmódba lépés: -> update  -->
            <!-- Látható: read -->
            <button
              type="button"
              class="btn btn-outline-warning btn-sm my-p-button"
              @click="updateOnclicked(indexR)"
              v-if="status=='read'"
            >
              <i class="bi bi-pencil-fill"></i>
            </button>

            <!-- törlés -->
            <!-- Látható: read -->
            <button
              type="button"
              class="btn btn-outline-danger btn-sm my-p-button"
              @click="deleteOnclicked(indexR)"
              v-if="status=='read'"
            >
              <i class="bi bi-x"></i>
            </button>

            <!-- Tárolás: -> read -->
            <!-- Látható: (update Or insert) And kattintott sor -->
            <button
              type="button"
              class="btn btn-outline-success btn-sm my-p-button"
              @click="saveOnclicked(indexR)"
              v-if="(status=='update' || status=='insert') && indexR==selectedRowIndex"
            >
              <i class="bi bi-check"></i>
            </button>

            <!-- Visszavonás: -> read -->
            <!-- Látható: (update Or insert) And kattintott sor -->
            <button
              type="button"
              class="btn btn-outline-warning btn-sm my-p-button"
              @click="backOnclicked()"
              v-if="(status=='update' || status=='insert') && indexR==selectedRowIndex"
            >
              <i class="bi bi-arrow-left-short"></i>
            </button>

          </td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script>
export default {
  name: "TableRender",
  props: ["columns", "rows", "query"],
  data() {
    return {
      status: "read", //insert, update
      selectedRowIndex: null,
      rowBuffer: null,
    };
  },
	created(){
		this.rowBuffer = this.getRowNull();
	},
  methods: {
		getRowNull() {
      let row = { ...this.rows[0] };
      for (const key in row) {
        row[key] = null;
      }
      return row;
    },
    rowsRefresh() {
      this.status = "read";
      this.$emit("clickRefresh");
    },
    insertOnclicked() {
			//  //üressel feltölt
      this.rowBuffer = this.getRowNull();
      // //hozzáfűzi az üreset
      this.rows.push(this.rowBuffer);
      // //ráállítja az utolsó indexre
      this.selectedRowIndex = this.rows.length - 1;
      // //insert üzemmódba kapcsol
      this.status = "insert";
    },
    updateOnclicked(index) {
      this.selectedRowIndex = index;
      this.status = "update";
      this.rowBuffer = {...this.rows[this.selectedRowIndex]};
    },
    deleteOnclicked(index) {
      let answer = window.confirm("Valóabn trölni akarod?");
			if(answer){
				//törlés
				this.$emit("clickDeleteRow", this.rows[index]);
				this.rows.splice(index,1);
			}
    },
    saveOnclicked(index) {
      this.selectedRowIndex = index;
      this.$emit("clickSaverRow", this.rows[this.selectedRowIndex])
      this.status = "read";
    },
    backOnclicked() {
      if (this.status=="insert") {
				this.rows.pop();
			}else{
				//update állapot
        this.rows[this.selectedRowIndex] = {...this.rowBuffer};
			}
      this.status = "read";
    },
  },
};
</script>

<style>
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

.my-hide {
  display: none;
}

.my-td-button {
  padding: 0 !important;
  vertical-align: middle;
}
</style>