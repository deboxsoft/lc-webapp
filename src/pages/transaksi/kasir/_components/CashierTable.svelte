<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import CashierRow from "./CashierRow.svelte";

  export let cashierStore;
</script>

<Table>
  <tr slot="header">
    <th width="100">No Kwitansi</th>
    <th width="100">Tanggal</th>
    <th>No Pendaftaran</th>
    <th width="200">Program</th>
    <th width="100">Diskon</th>
    <th width="170">Nominal</th>
<!--    <th width="30" />-->
  </tr>
  {#each $cashierStore as cashier (cashier.id)}
    <CashierRow {cashier} />
  {/each}
</Table>
<slot />