<script>
  import Table from "../../../components/tables/DataTable.svelte";
  import DepreciationRow from "./DepreciationRow.svelte";

  export let back = "../";
  export let categoryInventory;
  const depreciationList = categoryInventory.logs || [];
</script>

<div style="min-height: 250px">
  <Table class="table table-hover text-nowrap">
    <tr slot="header">
      <th>Bulan</th>
      <th>Biaya Depresiasi</th>
      <th style="width: 30px;" />
    </tr>
    {#each depreciationList as depreciation}
      <DepreciationRow {depreciation} />
    {/each}
  </Table>
</div>
