<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import ProductRow from "./ProductRow.svelte";

  export let productStore;
</script>

<Table>
  <tr slot="header">
    <th width="100" style="text-align: center">No</th>
    <th>Nama Barang</th>
    <th width="200">Kategori</th>
    <th width="200">Supplier</th>
    <th width="50">Satuan</th>
    <th width="100" style="text-align: center">Stok</th>
    <th width="175">Harga Satuan</th>
    <th width="30" />
  </tr>
  {#each $productStore as product (product.id)}
    <ProductRow {product} />
  {/each}
</Table>
<slot />
