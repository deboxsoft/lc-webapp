<script lang="ts">
  import Row from "./RowHistoryImportReconciliation.svelte";
  import { getBankStatementContext } from "__@modules/accounting";

  export let bankId: string;
  const { history, historyStore  } = getBankStatementContext();
  let loading = false;
  history(bankId).then(result => {
    loading = true;
  })
</script>

<table class="table table-togglable table-hover datatable-responsive-row-control dtr-column dataTable" role="grid">
  <thead>
  <tr role="row">
    <th class="control sorting_disabled d-table-cell">Tanggal Import</th>
    <th class="d-none d-lg-table-cell">Tanggal mulai</th>
    <th class="d-none d-xl-table-cell">Tanggal Akhir</th>
    <th class="text-center">Saldo Awal</th>
    <th class="text-center" >Saldo Akhir</th>
    <th class="text-center" >Status</th>
    <th class="text-center" style="width: 30px;">#</th>
  </tr>
  </thead>
  <tbody>
  {#each $historyStore as history}
    <Row {history} />
  {/each}
  </tbody>
</table>
