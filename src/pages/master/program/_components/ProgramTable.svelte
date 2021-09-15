<script>
  import Table from "../../../../components/tables/DataTable.svelte";
  import ProgramRow from "./ProgramRow.svelte";

  export let programStore;

</script>

<Table>
  <tr slot="header">
    <th>Nama</th>
    <th width="150">Periode</th>
    <!--    <div class="dbx-cell amount">Nominal</div>-->
    <th width="30" />
  </tr>
  {#each $programStore as program}
    <ProgramRow {program} />
  {/each}
</Table>
<slot />
