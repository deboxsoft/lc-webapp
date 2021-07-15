<script>

  import { stores } from "@deboxsoft/accounting-client";
  import CellAccount from "__@comps/account/CellAccount.svelte";

  const { getAmortization } = stores.getBddContext();
  export let categoryAmortization;
</script>

<dl class="row">
  <dt class="col-sm-3">Nama</dt>
  <p class="col-sm-9">
    : {categoryAmortization.name || "-"}
  </p>
  <dt class="col-sm-3">Umur Aset</dt>
  <p class="col-sm-9">
    : {categoryAmortization.estimatedLife || "-"}
  </p>
  <dt class="col-sm-3">Akun Aset</dt>
  <p class="col-sm-9">
    : <CellAccount id={categoryAmortization.assetAccount} />
  </p>
  <dt class="col-sm-3">Akun Akumulasi Depresiasi</dt>
  <p class="col-sm-9">
    : <CellAccount id={categoryAmortization.accumulatedDepreciationAccount} />
  </p>
  <dt class="col-sm-3">Akun Beban Depresiasi</dt>
  <p class="col-sm-9">
    : <CellAccount id={categoryAmortization.depreciationAccount} />
  </p>
  <dt class="col-sm-3">Rasio Depresiasi</dt>
  <p class="col-sm-9">
    : {categoryAmortization.ratio || "-"}
  </p>
  <dt class="col-sm-3">Nilai Residu</dt>
  <p class="col-sm-9">
    : {categoryAmortization.residualValue || "-"}
  </p>
</dl>
