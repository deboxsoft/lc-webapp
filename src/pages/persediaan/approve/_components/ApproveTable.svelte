<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import PurchaseRow from "./ApproveRow.svelte";

  export let stockTransactionStore;
  export let onSelect = undefined;

  function createSelectHandler(item) {
    return () => onSelect && onSelect(item);
  }
</script>

<div style="min-height: 250px">
  <Table class="table table-hover text-nowrap">
    <tr slot="header">
      <th width="120" style="text-align: center">No</th>
      <th width="90" style="text-align: center">Tanggal</th>
      <th>Deskripsi</th>
      <th width="160" style="text-align: center">Total</th>
      <th width="50" style="text-align: center">Status</th>
      <th width="30" />
    </tr>
    {#each $stockTransactionStore as stockTransaction (stockTransaction.id)}
      <PurchaseRow {stockTransaction} on:click={createSelectHandler(stockTransaction)} />
    {/each}
  </Table>
</div>
