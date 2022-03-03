<script>
  import { stores } from "@deboxsoft/accounting-client";
  import ProductItemRow from "__@root/pages/persediaan/approve/_components/ProductItemRow.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { getCategoryStock, productContext } = stores.getStockContext();
  const { findByIds } = productContext;

  /**
   * @type{import("@deboxsoft/accounting-api").StockTransaction}
   */
  export let stockTransaction;

  function getProduct(productId, products) {
    const i = products.findIndex((_) => _.id === productId);
    return products[i];
  }
</script>

<table class="table">
  <thead>
    <tr>
      <th class="text-center">Nama Barang</th>
      <th class="text-center" width="70">Jumlah</th>
      <th class="text-center" width="70">Unit</th>
      <th class="text-center" width="200">Harga Satuan</th>
      <th class="text-center" width="200">Total</th>
    </tr>
  </thead>
  <tbody>
    {#await findByIds(stockTransaction.productItems.map((_) => _.productId))}
      <Loader />
    {:then products}
      {#each stockTransaction.productItems as productItem}
        <ProductItemRow {productItem} product={getProduct(productItem.productId, products)} />
      {/each}
    {/await}
  </tbody>
</table>
