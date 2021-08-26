<script>
  import Table from "../../../components/tables/DataTable.svelte";
  import CategoryInventoryRow from "./CategoryInventoryRow.svelte";

  export let categoryInventoryStore;
</script>

<div style="min-height: 250px">
  <Table class="table table-hover text-nowrap">
    <tr slot="header">
      <th>Nama</th>
      <th style="width: 200px">Kelompok Depresiasi</th>
      <th style="width: 200px">Akumulasi Penyusutan Aktiva Tetap</th>
      <th style="width: 200px">Biaya Penyusutan Aktiva Tetap</th>
      <th style="width: 30px;" />
    </tr>
    {#each $categoryInventoryStore as categoryInventory}
      <CategoryInventoryRow {categoryInventory} />
    {/each}
  </Table>
</div>
