<script>
  import CellAccount from "../../../components/account/CellAccount.svelte";

  export let categoryAmortization;
</script>

<dl class="row">
  <dt class="col-sm-3">Nama</dt>
  <p class="col-sm-9">
    : {categoryAmortization.name || "-"}
  </p>
  <dt class="col-sm-3">Akun Biaya Amortisasi</dt>
  <p class="col-sm-9">
    : <CellAccount id={categoryAmortization.expenseAccount} />
  </p>
  <dt class="col-sm-3">Akun Amortisasi</dt>
  <p class="col-sm-9">
    : <CellAccount id={categoryAmortization.amortizationAccount} />
  </p>
</dl>
