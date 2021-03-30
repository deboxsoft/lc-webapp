<script lang="ts">
  import RowJournal from "./RowJournal.svelte";
  import { getTransactionContext } from "__@modules/accounting";

  const { transactionStore } = getTransactionContext();

</script>

<div
  class="h-100"
>
  <table class="table table-togglable table-hover datatable-responsive-row-control dtr-column dataTable" role="grid">
    <thead>
      <tr role="row">
        <th class="text-center control sorting_disabled d-table-cell" style="width: 20px;">#</th>
        <th class="d-none d-xl-table-cell" style="width: 150px;">No Transaksi</th>
        <th class="d-none d-lg-table-cell" style="width: 150px;">No</th>
        <th class="text-center" style="width: 150px">Tanggal</th>
        <th class="text-center" style="width: 150px">Akun Debit</th>
        <th>Deskripsi</th>
        <th class="text-center" style="width: 200px;">Jumlah</th>
        <th class="text-center" style="width: 30px;">#</th>
      </tr>
    </thead>
    <tbody>
      {#each $transactionStore as item (item.id)}
        <RowJournal expanded={false} journal={item} />
      {/each}
    </tbody>
  </table>
</div>
