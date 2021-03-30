<script lang="ts">
  import RowBukuBesar from "./RowBukuBesar.svelte";
  import { getGeneralLedgerContext} from "__@modules/accounting";

  const { generalLedgerStore } = getGeneralLedgerContext();


</script>

<table class="table table-hover datatable-responsive-row-control" role="grid">
  <thead>
  <tr role="row">
    <th class="fit d-none d-xl-table-cell" style="width: 150px;">Tanggal</th>
    <th style="width: 250px">No Transaksi</th>
    <th class="d-none d-xl-table-cell">Deskripsi</th>
    <th style="width: 250px;">Mutasi</th>
    <th style="width: 250px;">Saldo</th>
  </tr>
  </thead>
  <tbody>
  {#each $generalLedgerStore as generalLedger}
    <RowBukuBesar {generalLedger} />
  {/each}
  </tbody>
</table>
