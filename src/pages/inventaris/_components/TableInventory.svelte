<script lang="ts">
  import { stores } from "@deboxsoft/accounting-client";
  import dayjs from "dayjs";
  import { get } from "svelte/store";
  import CellRp from "__@comps/CellRp.svelte";

  const { inventoryStore, getCategoryInventory } = stores.getInventoryContext();
</script>

<table class="table table-hover text-nowrap">
  <thead>
    <tr role="row">
      <th class="d-table-cell">Nama Barang</th>
      <th class="text-center">Tanggal Pembelian</th>
      <th class="text-center">Kategori</th>
      <th class="text-center">Harga Satuan</th>
      <th class="text-center">Jumlah</th>
      <th class="text-center">Harga Total</th>
      <th class="text-center" style="width: 30px;" />
    </tr>
  </thead>
  <tbody>
    {#each $inventoryStore as inventory}
      <tr>
        <td>{inventory.name || ""}</td>
        <td>{dayjs(purchaseDate).format()}</td>
        <td>{get(getCategoryInventory(inventory.categoryId))?.name || ""}</td>
        <td>
          <CellRp value={inventory.priceItem} />
        </td>
        <td>{inventory.quantity}</td>
        <td>
          <CellRp value={inventory.priceItem * inventory.quantity} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="flex-1" />

