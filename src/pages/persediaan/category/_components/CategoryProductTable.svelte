<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import CategoryProductRow from "./CategoryProductRow.svelte";

  export let categoryProductStore;
</script>

<div style="min-height: 250px">
  <Table class="table table-hover text-nowrap">
    <tr slot="header">
      <th>Nama</th>
      <th style="width: 200px">Akun Persediaan</th>
      <th style="width: 30px;" />
    </tr>
    {#each $categoryProductStore as categoryProduct (categoryProduct.id)}
      <CategoryProductRow {categoryProduct} />
    {/each}
  </Table>
</div>
