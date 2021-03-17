<script lang="ts">
  import { useVirtualList } from "@deboxsoft/svelte-core";
  import RowJournal from "./RowJournal.svelte";
  import { getTransactionContext } from "__@modules/accounting";

  const { transactionStore } = getTransactionContext();
  let items = [];
  function itemsUpdatedHandler(e) {
    items = e.detail.items;
  }
</script>

<table
  class="table table-togglable table-hover datatable-responsive-row-control dtr-column dataTable"
  role="grid"
  use:useVirtualList={{ itemCount: $transactionStore.length }}
  on:items-updated={itemsUpdatedHandler}>
  <thead>
    <tr role="row">
      <th class="text-center control sorting_disabled d-table-cell" style="width: 20px;">#</th>
      <th class="d-none d-lg-table-cell" style="width: 150px;">No</th>
      <th class="d-none d-xl-table-cell" style="width: 150px;">No Transaksi</th>
      <th class="text-center" style="width: 150px">Tanggal</th>
      <th class="text-center" style="width: 150px">Akun</th>
      <th>Deskripsi</th>
      <th class="text-center" style="width: 200px;">Total</th>
    </tr>
  </thead>
  <tbody>
    {#each items as item (item.index)}
      <RowJournal expanded={false} journal={$transactionStore[item.index]} />
    {/each}
  </tbody>
</table>
