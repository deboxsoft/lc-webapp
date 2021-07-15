<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Loader from "__@comps/loader/Loader.svelte";
  import Table from "__@comps/tables/DataTable.svelte";
  import RowListInventory from "./RowListBdd.svelte";

  const { findPage, inventoryStore, getCategoryInventory } = stores.getInventoryContext();
  let state = "find-start";
  findPage({filter: {}, pageCursor: {}}).then(() => {
    state = "find-finish";
  });
</script>

<Table>
  <tr slot="header">
    <th>Nama Barang</th>
    <th style="width: 50px">Tanggal Pembelian</th>
    <th>Kategori</th>
    <th>Harga Satuan</th>
    <th>Jumlah</th>
    <th>Harga Total</th>
    <th style="width: 30px;" />
  </tr>
  {#if state === "find-start"}
    <Loader />
  {/if}
  {#each $inventoryStore as inventory}
    <RowListInventory {inventory} />
  {/each}
</Table>
<div class="flex-1" />
