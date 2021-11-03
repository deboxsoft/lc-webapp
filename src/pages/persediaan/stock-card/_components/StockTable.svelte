<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import StockRow from "./StockRow.svelte";

  export let stockStore;
</script>

<Table>
  <svelte:fragment slot="header">
    <tr>
      <th width="100" rowspan="2" style="text-align: center">No</th>
      <th width="100" rowspan="2" style="text-align: center">Tanggal</th>
      <th rowspan="2" style="text-align: center">Nama Barang</th>
      <th rowspan="2" style="text-align: center" width="50">Status</th>
      <th rowspan="2" style="text-align: center" width="50">Mutasi</th>
      <th width="70" rowspan="2" style="text-align: center">Satuan</th>
      <th colspan="2" style="text-align: center">Mutasi</th>
      <th width="70" style="text-align: center" rowspan="2">Sisa</th>
      <th width="175" style="text-align: center" rowspan="2">Harga Satuan</th>
      <th width="30" rowspan="2"/>
    </tr>
    <tr>
      <th width="70" style="text-align: center">Masuk</th>
      <th width="70" style="text-align: center">Keluar</th>
    </tr>
  </svelte:fragment>
  {#each $stockStore as stock (stock.id)}
    <StockRow {stock} />
  {/each}
</Table>
<slot />
