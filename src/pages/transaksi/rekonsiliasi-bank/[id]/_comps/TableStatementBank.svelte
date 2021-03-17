<script lang="ts">
  import Row from "./RowStatementBank.svelte";
  import { getReconciliationContext } from "__@modules/accounting";

  const { bankStatementStore } = getReconciliationContext();
  export let bankStatementList = $bankStatementStore;
  export let filtering = false;
  let selected = true;
</script>

<table class="table table-togglable table-hover datatable-responsive-row-control dtr-column dataTable" role="grid">
  <thead>
    <tr role="row">
      {#if filtering}
        <th style="width: 10px" />
      {/if}
      <th class="d-table-cell text-center">Tanggal</th>
      <th class="d-none d-lg-table-cell">Diskripsi</th>
      <th class="d-none d-xl-table-cell">Masuk</th>
      <th class="text-center">Keluar</th>
      <th class="text-center">Saldo</th>
    </tr>
  </thead>
  <tbody>
    {#each bankStatementList as statementBank}
      <Row {statementBank} {selected} showCheckbox={filtering} />
    {/each}
  </tbody>
</table>
