<script lang="ts">
  import Row from "./RowConciliation.svelte";
  import { getReconciliationContext } from "__@modules/accounting";

  const { bankReconciliationStore, findBankReconciliation } = getReconciliationContext();

</script>

<table class="table table-togglable table-hover datatable-responsive-row-control dtr-column dataTable" role="grid">
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
    {#each $bankReconciliationStore as bankReconciliation}
      <Row {bankReconciliation} />
    {/each}
  </tbody>
</table>
