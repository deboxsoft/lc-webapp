<script>
  import { calcAmortization } from "@deboxsoft/accounting-api";
  import Table from "__@comps/tables/DataTable.svelte";
  import AmortizationRow from "./AmortizationRow.svelte";
  import BddInfo from "./_BddInfo.svelte";

  /** @type {import("@deboxsoft/accounting-api").Bdd} **/
  export let bdd;
  const { amortizationAccumulation, amortizationAmount, amortizationRemaining, tax, bookValue, rate, total } =
    calcAmortization(bdd);
</script>

<BddInfo
  class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1"
  {bdd}
  {amortizationAccumulation}
  {amortizationAmount}
  {amortizationRemaining}
  {tax}
  {bookValue}
  {rate}
  {total}
/>
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
