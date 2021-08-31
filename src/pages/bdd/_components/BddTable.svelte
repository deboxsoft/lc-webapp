<script>
  import Table from "../../../components/tables/DataTable.svelte";
  import BddRow from "./BddRow.svelte";

  export let bddStore;
</script>

<Table>
  <tr slot="header">
    <th style="width: 100px"> Tanggal </th>
    <th style="width: 120px">Tanggal Awal</th>
    <th style="width: 120px">Tanggal Akhir</th>
    <th>Deskripsi</th>
    <th style="width: 80px">Pajak (%)</th>
    <th style="width: 160px">Nominal</th>
    <th style="width: 160px">Total</th>
    <th style="width: 30px;" />
  </tr>
  {#each $bddStore as bdd}
    <BddRow {bdd} />
  {/each}
</Table>
