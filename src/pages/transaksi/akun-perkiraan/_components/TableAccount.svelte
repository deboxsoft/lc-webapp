<script lang="ts">
  import Table from "__@comps/Table.svelte";
  import { goto } from "@roxi/routify";
  import { getAccountContext } from "__@modules/accounting";
  import RowAccount from "./RowAccount.svelte";

  const { getAccountType } = getAccountContext();
  export let accounts = [];
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

<Table items={accounts} let:item>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell text-center" style="width: 200px">Kode</div>
    <div class="dbx-cell">Nama</div>
    <div class="dbx-cell">Klasifikasi</div>
    <div class="dbx-cell">Induk</div>
    <div class="dbx-cell text-center" style="width: 100px" />
  </div>
  <RowAccount account={item} />
</Table>
