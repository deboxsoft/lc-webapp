<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import SupplierRow from "./SupplierRow.svelte";

  export let supplierStore;
</script>

<div style="min-height: 250px">
  <Table class="table table-hover text-nowrap">
    <tr slot="header">
      <th width="250">Nama</th>
      <th>Alamat</th>
      <th width="150">No Hp</th>
      <th width="200">Email</th>
      <th width="30" />
    </tr>
    {#each $supplierStore as supplier}
      <SupplierRow {supplier} />
    {/each}
  </Table>
</div>
