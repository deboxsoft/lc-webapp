<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import AmortizationRow from "./AmortizationRow.svelte";
  import dayjs from "dayjs";
  import CellNumber from "__@comps/CellNumber.svelte";

  /** @type {import("@deboxsoft/accounting-api").Bdd} **/
  export let bdd;
  const amortizationList = bdd.logs || [];
  const date = dayjs(bdd.date);
  const dateEnd = dayjs(bdd.dateEnd);
  const countMonth = dateEnd.diff(date, "month");
  const tax = bdd.taxRate > 0 ? (bdd.taxRate * bdd.amount) / 100 : 0;
  const amount = bdd.amount + tax;
  const amortizationAmount = countMonth > 0 ? amount / countMonth : 0;
  const totalAmortization = amount * amortizationList.length;
</script>

<div class="border-bottom-grey
-600 border-bottom-1 mb-1 pb-1">
  <dl class="row mb-0">
    <dt class="col-sm-4 mb-0">Biaya Amortisasi</dt>
    <p class="col-sm-8 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber value={amortizationAmount} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-4 mb-0">Jumlah Bulan Amortisasi</dt>
    <p class="col-sm-8 mb-0">: {`${amortizationList.length} dari ${countMonth} bulan`}</p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-4 mb-0">Total Akumulasi Amortisasi</dt>
    <p class="col-sm-8 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber value={totalAmortization} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-4 mb-0">Total Amortisasi</dt>
    <p class="col-sm-8 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber value={amount} /></span>
    </p>
  </dl>
</div>
<div style="min-height: 250px">
  <Table class="table table-hover text-nowrap">
    <tr slot="header">
      <th>Bulan</th>
      <th>Biaya Amortisasi</th>
      <th style="width: 30px;" />
    </tr>
    {#each bdd.logs || [] as amortization}
      <AmortizationRow {amortization} />
    {/each}
  </Table>
</div>
