<script>

  import { stores } from "@deboxsoft/accounting-client";
  import { getGroupDepreciation } from "@deboxsoft/accounting-api";
  import CellAccount from "../../../components/account/CellAccount.svelte";

  const { getCategoryInventory } = stores.getInventoryContext();
  export let categoryInventory;
</script>

<dl class="row">
  <dt class="col-sm-3">Nama</dt>
  <p class="col-sm-9">
    : {categoryInventory.name || "-"}
  </p>
  <dt class="col-sm-3">Umur Aset</dt>
  <p class="col-sm-9">
    : {categoryInventory.estimatedLife || "-"}
  </p>
  <dt class="col-sm-3">Akun Aset</dt>
  <p class="col-sm-9">
    : <CellAccount id={categoryInventory.assetAccount} />
  </p>
  <dt class="col-sm-3">Akun Akumulasi Depresiasi</dt>
  <p class="col-sm-9">
    : <CellAccount id={categoryInventory.accumulatedDepreciationAccount} />
  </p>
  <dt class="col-sm-3">Akun Beban Depresiasi</dt>
  <p class="col-sm-9">
    : <CellAccount id={categoryInventory.depreciationAccount} />
  </p>
  <dt class="col-sm-3">Rasio Depresiasi</dt>
  <p class="col-sm-9">
    : {categoryInventory.ratio || "-"}
  </p>
  <dt class="col-sm-3">Nilai Residu</dt>
  <p class="col-sm-9">
    : {categoryInventory.residualValue || "-"}
  </p>
</dl>
