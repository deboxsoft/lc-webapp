<script>
  import { goto } from "@roxi/routify";
  import Table from "../../../../components/tables/DataTable.svelte";
  import ProgramRow from "./ProgramRow.svelte";

  export let programStore;

  function createUpdateHandler(id) {
    return () => {
      $goto("./:id/update", { id });
    };
  }

  function createRemoveHandler(id) {
    return () => {
      $goto("./:id/remove", { id });
    };
  }
</script>

<Table>
  <tr slot="header">
    <th>Nama</th>
    <th style="width: 150px">Diskon</th>
    <!--    <div class="dbx-cell amount">Nominal</div>-->
    <th style="width: 30px" />
  </tr>
  {#each $programStore as program}
    <ProgramRow {program} />
  {/each}
</Table>
<slot />
