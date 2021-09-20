<script>
  import { getGroupDepreciation } from "@deboxsoft/accounting-api";
  import CellAccount from "__@comps/account/CellAccount.svelte";

  export let categoryInventory;
</script>

<dl class="row">
  <dt class="col-sm-5">Nama</dt>
  <p class="col-sm-7">
    : {categoryInventory.name || "-"}
  </p>
  <dt class="col-sm-5">Biaya Penyusutan Aktiva Tetap</dt>
  <p class="col-sm-7 d-inline-flex align-items-center">
    : <CellAccount class="ml-1" id={categoryInventory.expenseDepreciationAccount} />
  </p>
  <dt class="col-sm-5">Akumulasi Penyusutan Aktiva Tetap</dt>
  <p class="col-sm-7 d-inline-flex align-items-center">
    : <CellAccount class="ml-1" id={categoryInventory.accumulatedDepreciationAccount} />
  </p>
  <dt class="col-sm-5">Kelompok Tarif Depresiasi</dt>
  <p class="col-sm-7">
    : {getGroupDepreciation(categoryInventory.groupDepreciationId)?.label || "-"}
  </p>
</dl>
