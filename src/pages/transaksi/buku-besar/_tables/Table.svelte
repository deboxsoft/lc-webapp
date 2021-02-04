<script lang="ts">
  import type { Transaction } from "@deboxsoft/accounting-api";
  let transactionList;
</script>

<table class="table table-togglable table-hover datatable-responsive-row-control dtr-column dataTable" role="grid">
  <thead>
    <tr role="row">
      <th class="text-center control sorting_disabled d-table-cell" style="width: 20px;">#</th>
      <th class="fit d-none d-lg-table-cell" style="width: 100px;">No</th>
      <th class="fit d-none d-xl-table-cell" style="width: 100px;">No Transaksi</th>
      <th style="width: 100px">Tanggal</th>
      <th>Deskripsi</th>
      <th style="width: 10px;">Total</th>
    </tr>
  </thead>
  <tbody>
    <!--{#each transactionList as transaction}-->
    <!--  <div />-->
    <!--{/each}-->
  </tbody>
</table>
