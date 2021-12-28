<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import { stores } from "@deboxsoft/accounting-client";

  const { getCategoryStock } = stores.getStockContext();
  const { getProduct } = stores.getProductContext();

  /**
   * @type{import("@deboxsoft/accounting-api").StockTransaction}
   */
  export let stockTransaction;

  function getTotal(item) {
    return item.quantity * item.price;
  }
</script>

<table class="table">
  <thead>
    <tr>
      <th class="text-left">Nama Barang</th>
      <th class="text-center" width="70">Jumlah</th>
      <th class="text-center" width="200">Harga Satuan</th>
      <th class="text-center" width="200">Total</th>
    </tr>
  </thead>
  <tbody>
    {#each stockTransaction.items as item}
      <tr>
        <td>{getProduct(item.productId) || "-"}</td>
        <td><CellNumber format="number" value={item.quantity} /></td>
        <td><CellNumber value={item.price} /></td>
        <td><CellNumber value={getTotal(item)} /></td>
      </tr>
    {/each}
  </tbody>
</table>
