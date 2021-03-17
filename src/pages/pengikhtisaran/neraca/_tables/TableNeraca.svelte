<script lang="ts">
  import Row from "./RowNeraca.svelte";
  import { getGeneralLedgerContext } from "__@modules/accounting";

  const { balanceSheetStore } = getGeneralLedgerContext();
</script>

<table class="table table-togglable table-hover datatable-responsive-row-control dtr-column dataTable" role="grid">
  <thead>
    <tr role="row">
      <th class="control sorting_disabled d-table-cell">Bank</th>
      <th class="d-none d-lg-table-cell">Akun Bank</th>
      <th class="d-none d-xl-table-cell">Akun Perkiraan</th>
      <th class="text-center" >Saldo</th>
    </tr>
  </thead>
  <tbody>
    {#each $balanceSheetStore as balanceSheet}
      <Row {balanceSheet} />
    {/each}
  </tbody>
</table>
