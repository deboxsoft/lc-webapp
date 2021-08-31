<script>
  import CellRp from "../../../components/CellRp.svelte";
  import dayjs from "dayjs";

  /** @type{import("@deboxsoft/accounting-api").Bdd} */
  export let bdd;
</script>

<dl class="row">
  <dt class="col-sm-3">Tanggal</dt>
  <p class="col-sm-9">
    : {dayjs(bdd.date).format("DD-MM-YY") || "-"}
  </p>
  <dt class="col-sm-3">Tanggal Awal</dt>
  <p class="col-sm-9">
    : {dayjs(bdd.dateStart).format("DD-MM-YY") || "-"}
  </p>
  <dt class="col-sm-3">Tanggal Akhir</dt>
  <p class="col-sm-9">
    : {dayjs(bdd.dateEnd).format("DD-MM-YY") || "-"}
  </p>
  <dt class="col-sm-3">Keterangan</dt>
  <p class="col-sm-9">
    : {bdd.description || "-"}
  </p>
  <dt class="col-sm-3">Pajak (%)</dt>
  <p class="col-sm-9">
    : {bdd.taxRate || "-"}
  </p>
  <dt class="col-sm-3">Jumlah</dt>
  <p class="col-sm-9 d-inline-flex align-items-center">
    : <span style="width: 150px"><CellRp class="ml-1" value={bdd.amount} /></span>
  </p>
</dl>
