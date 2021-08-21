<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Loader from "../../../components/loader/Loader.svelte";
  import Table from "../../../components/tables/DataTable.svelte";
  import RowListStock from "./RowListStock.svelte";

  const { findPage, stockStore } = stores.getStockTransferContext();
  let state = "find-start";
  findPage({filter: {}, pageCursor: {}}).then(() => {
    state = "find-finish";
  });
</script>

<Table>
  <tr slot="header">
    <th>Nama Barang</th>
    <th style="width: 50px">Jumlah</th>
    <th style="width: 175px">Harga Satuan</th>
    <th style="width: 175px">Total</th>
    <th style="width: 30px;" />
  </tr>
  {#if state === "find-start"}
    <Loader />
  {/if}
  {#each $stockStore as stock}
    <RowListStock {stock} />
  {/each}
</Table>
<div class="flex-1" />
