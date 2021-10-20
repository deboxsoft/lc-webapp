<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import BddRow from "./BddRow.svelte";

  export let bddStore;
</script>

<Table>
  <tr slot="header">
    <th width="90" style="text-align: center"> No </th>
    <th width="90" style="text-align: center">Tanggal Awal</th>
    <th width="90" style="text-align: center">Tanggal Akhir</th>
    <th>Deskripsi</th>
    <th width="100">Kategori</th>
    <th width="70" style="text-align: center">Pajak (%)</th>
    <th width="160" style="text-align: center">Nominal</th>
    <th width="160" style="text-align: center">Total</th>
    <th width="30" />
  </tr>
  {#each $bddStore as bdd (bdd.id)}
    <BddRow {bdd} />
  {/each}
</Table>
<slot />
