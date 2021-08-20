<script>
  import { stores } from "@deboxsoft/accounting-client";
  import CellRp from "../../../components/CellRp.svelte";

  const { getBdd } = stores.getBddContext();
  export let bdd;
</script>

<dl class="row">
  <dt class="col-sm-3">Nama</dt>
  <p class="col-sm-9">
    : {bdd.name || "-"}
  </p>
  <dt class="col-sm-3">Jumlah Akumulasi Amortisasi</dt>
  <p class="col-sm-9">
    : <CellRp value={0} />
  </p>
</dl>
