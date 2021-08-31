<script>
  import CellRp from "../../../components/CellRp.svelte";
  /** @type {import("@deboxsoft/accounting-api").Bdd} */
  export let bdd;
  let total = 0;

  /** @type {import("@deboxsoft/accounting-api").Amortization[]}*/
  const amortization = bdd.logs || [];
  if (amortization.length > 0) {
    total = amortization[0].amount * amortization.length;
  }
  amortization.forEach(_ => {
    total += _.amount;
  });
</script>

<dl class="row">
  <dt class="col-sm-3">Nama</dt>
  <p class="col-sm-9">
    : {bdd.name || "-"}
  </p>
  <dt class="col-sm-3">Total Akumulasi Biaya Amortisasi</dt>
  <p class="col-sm-9">
    : <CellRp value={total} />
  </p>
</dl>
