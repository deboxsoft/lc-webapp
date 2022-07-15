<script>
  import { calcAmortization } from "@deboxsoft/accounting-api";
  import Table from "__@comps/tables/DataTable.svelte";
  import AmortizationRow from "./AmortizationRow.svelte";
  import BddInfo from "./_BddInfo.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import Loader from "__@comps/loader/Loader.svelte";

  const { getAmortizationBdd } = stores.getBddContext();

  /** @type {import("@deboxsoft/accounting-api").Bdd} **/
  export let bdd;
  /** @type{import("@deboxsoft/accounting-api").Amortization[]} **/
  let amortizationList = [];
  let loading = true;
  getAmortizationBdd(bdd.id).then((_) => {
    amortizationList = _;
    loading = false;
  });
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
<div class="amortization-data">
  {#if loading}
    <Loader />
  {:else}
    <Table class="table table-hover text-nowrap">
      <tr slot="header" class="amortization-header">
        <th>Bulan</th>
        <th>Biaya Amortisasi</th>
      </tr>
      {#each amortizationList as amortization}
        <AmortizationRow {amortization} />
      {/each}
    </Table>
  {/if}
</div>

<style>
  .amortization-header {
    position: sticky;
    top: 0;
    background: #fff;
  }
  .amortization-data {
    height: 125px;
    overflow-y: auto;
  }
</style>
