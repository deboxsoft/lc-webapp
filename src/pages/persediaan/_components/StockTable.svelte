<script>
  import Table from "../../../components/tables/DataTable.svelte";
  import StockRow from "./StockRow.svelte";

  export let stockStore;
</script>

<Table>
  <tr slot="header">
    <th>Nama Barang</th>
    <th style="width: 50px">Jumlah</th>
    <th style="width: 175px">Harga Satuan</th>
    <th style="width: 175px">Total</th>
    <th style="width: 30px;" />
  </tr>
  {#each $stockStore as stock}
    <StockRow {stock} />
  {/each}
</Table>
<slot />
