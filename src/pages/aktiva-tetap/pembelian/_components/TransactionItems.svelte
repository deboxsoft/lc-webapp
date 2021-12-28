<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import { stores } from "@deboxsoft/accounting-client";

  const { getCategoryInventory } = stores.getInventoryContext();

  /**
   * @type{import("@deboxsoft/accounting-api").InventoryTransaction}
   */
  export let inventoryTransaction;

  function getTotal(item) {
    return item.quantity * item.priceItem;
  }
</script>

<table class="table">
  <thead>
    <tr>
      <th class="text-left">Nama Aset</th>
      <th class="text-left" width="150">Kategori</th>
      <th class="text-center" width="70">Jumlah</th>
      <th class="text-center" width="200">Harga Satuan</th>
      <th class="text-center" width="200">Total</th>
    </tr>
  </thead>
  <tbody>
    {#each inventoryTransaction.items as item}
      <tr>
        <td>{item.name || "-"}</td>
        <td>{getCategoryInventory(item.categoryId).name || "-"}</td>
        <td><CellNumber format="number" value={item.quantity} /></td>
        <td><CellNumber value={item.priceItem} /></td>
        <td><CellNumber value={getTotal(item)} /></td>
      </tr>
    {/each}
  </tbody>
</table>
