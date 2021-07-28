<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Loader from "__@comps/loader/Loader.svelte";
  import Table from "__@comps/tables/DataTable.svelte";
  import RowCategoryInventory from "./RowCategoryAmortization.svelte";

  const { amortizationStore, findCategory } = stores.getBddContext();
  let state = "find-start";
  findCategory().then(() => {
    state = "find-finish";
  });
</script>

<Table class="table table-hover text-nowrap">
  <tr slot="header">
    <th>Nama</th>
    <th>Umur Aset</th>
    <th>Akun Aset</th>
    <th>Akun Akumulasi Depresiasi</th>
    <th>Akun Beban Depresiasi</th>
    <th style="width: 30px;" />
  </tr>
  {#if state === "find-start"}
    <Loader />
  {/if}
  {#each $categoryInventoryStore as categoryInventory}
    <RowCategoryInventory {categoryInventory} />
  {/each}
</Table>
<div class="flex-1" />
