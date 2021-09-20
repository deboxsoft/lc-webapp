<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import InventoryRow from "./InventoryRow.svelte";

  export let inventoryStore;

</script>

<Table>
  <tr slot="header">
    <th>Nama Barang</th>
    <th style="width: 90px">Tanggal</th>
    <th>Kategori</th>
    <th style="width: 80px">Jumlah</th>
    <th style="width: 160px">Harga Satuan</th>
    <th style="width: 160px">Harga Total</th>
    <th style="width: 30px;" />
  </tr>
  {#each $inventoryStore as inventory}
    <InventoryRow {inventory} />
  {/each}
</Table>
