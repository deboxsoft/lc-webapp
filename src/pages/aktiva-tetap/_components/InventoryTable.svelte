<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import InventoryRow from "./InventoryRow.svelte";

  export let inventoryStore;

</script>

<Table class="table-hover text-nowrap">
  <tr slot="header">
    <th width="90" style="text-align: center">No</th>
    <th width="90" style="text-align: center">Tanggal</th>
    <th width="90" style="text-align: center">Tanggal Perolehan</th>
    <th>Nama Asset</th>
    <th width="100">Kategori</th>
    <th width="160" style="text-align: center">Nilai Buku</th>
    <th width="50" style="text-align: center">Jumlah</th>
    <th width="160" style="text-align: center">Harga Satuan</th>
    <th width="160" style="text-align: center">Harga Total</th>
  </tr>
  {#each $inventoryStore as inventory (inventory.id)}
    <InventoryRow {inventory} />
  {/each}
</Table>
