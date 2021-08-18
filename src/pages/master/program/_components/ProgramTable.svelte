<script>
  import { goto } from "@roxi/routify";
  import ProgramMenuList from "./ProgramMenuList.svelte";
  import Table from "../../../../components/Table.svelte";
  import CellRp from "../../../../components/CellRp.svelte";

  export let programList = [];

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

<Table items={programList} let:item={program}>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell">Nama</div>
    <div class="dbx-cell">Diskon</div>
    <div class="dbx-cell amount">Nominal</div>
    <div class="dbx-cell -menu-list" />
  </div>
  <div class="dbx-tr">
    <div class="dbx-cell">{program.name || "-"}</div>
    <div class="dbx-cell discount">{program.discount || "-"}
    </div>
    <div class="dbx-cell amount">
      <CellRp value={program.amount} />
    </div>
    <div class="dbx-cell -menu-list">
      <ProgramMenuList id={program.id} />
    </div>
  </div>
</Table>

<style lang="scss">

  .discount {
    flex: 0 0 150px;
  }
  .amount {
    flex: 0 0 200px;
  }
</style>
