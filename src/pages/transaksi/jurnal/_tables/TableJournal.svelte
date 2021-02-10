<script lang="ts">
  import RowJournal from "./RowJournal.svelte";
  import { getTransactionContext } from "__@modules/accounting";

  const { transactionStore } = getTransactionContext();
</script>

<table class="table table-togglable table-hover datatable-responsive-row-control dtr-column dataTable" role="grid">
  <thead>
    <tr role="row">
      <th class="text-center control sorting_disabled d-table-cell" style="width: 20px;">#</th>
      <th class="d-none d-lg-table-cell" style="width: 150px;">No</th>
      <th class="d-none d-xl-table-cell" style="width: 150px;">No Transaksi</th>
      <th class="text-center" style="width: 150px">Tanggal</th>
      <th>Deskripsi</th>
      <th class="text-center" style="width: 200px;">Total</th>
    </tr>
  </thead>
  <tbody>
    {#each $transactionStore as transaction}
      <RowJournal expanded={false} journal={transaction} />
    {/each}
  </tbody>
</table>
