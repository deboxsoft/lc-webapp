<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import StockRow from "./StockRow.svelte";

  export let stockStore;
</script>

<Table>
  <tr slot="header">
    <th width="100">Tanggal</th>
    <th width>Nama Barang/PCS</th>
    <th width="50">Satuan</th>
    <th width="50">Mutasi</th>
    <th width="175">Jumlah Unit</th>
    <th width="175">Harga Satuan</th>
    <th width="175">Sisa</th>
    <th width="175">Total</th>
    <th width="30" />
  </tr>
  {#each $stockStore as stock}
    <StockRow {stock} />
  {/each}
</Table>
<slot />
