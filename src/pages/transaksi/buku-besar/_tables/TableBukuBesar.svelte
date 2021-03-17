<script lang="ts">
  import RowBukuBesar from "./RowBukuBesar.svelte";
  import { getGeneralLedgerContext} from "__@modules/accounting";

  const { generalLedgerStore } = getGeneralLedgerContext();

</script>

<table class="table table-hover datatable-responsive-row-control" role="grid">
  <thead>
  <tr role="row">
    <th class="fit d-none d-lg-table-cell" style="width: 150px;">No</th>
    <th class="fit d-none d-xl-table-cell" style="width: 150px;">Tanggal</th>
    <th style="width: 150px">Akun</th>
    <th>Deskripsi</th>
    <th style="width: 250px;">Total</th>
  </tr>
  </thead>
  <tbody>
  {#each $generalLedgerStore as generalLedger}
    <RowBukuBesar {generalLedger} />
  {/each}
  </tbody>
</table>
