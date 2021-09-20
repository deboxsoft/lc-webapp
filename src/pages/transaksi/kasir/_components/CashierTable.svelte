<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import CashierRow from "./CashierRow.svelte";

  export let cashierStore;
</script>

<Table>
  <tr slot="header">
    <th style="width: 50px">Tanggal</th>
    <th>Nama</th>
    <th>Program</th>
    <th>Diskon</th>
    <th>Nominal</th>
    <th style="width: 30px;" />
  </tr>
  {#each $cashierStore as cashier}
    <CashierRow {cashier} />
  {/each}
</Table>
<slot />