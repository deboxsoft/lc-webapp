<script lang="ts">
  // import Row from "./RowAktvaTetap.svelte";
  import { getInventoryContext } from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";
  // import Loader from "__@comps/loader/Loader.svelte";

  const { inventoryStore } = getInventoryContext();
  function infiniteHandler() {}
</script>

<Table items={$inventoryStore} let:item on:infinite={infiniteHandler}>
  <thead>
    <tr role="row">
      <th class="control sorting_disabled d-table-cell">Bank</th>
      <th class="d-none d-lg-table-cell">Akun Bank</th>
      <th class="d-none d-xl-table-cell">Akun Perkiraan</th>
      <th class="text-center">Saldo Bank</th>
      <th class="text-center" >Saldo Akun</th>
      <th class="text-center" >Status</th>
      <th class="text-center" style="width: 30px;">#</th>
    </tr>
  </thead>
  <tbody>
    <!--{#each $bankReconciliationStore as bankReconciliation}-->
    <!--  <Row expanded={false} {bankReconciliation} />-->
    <!--{/each}-->
  </tbody>
</Table>
