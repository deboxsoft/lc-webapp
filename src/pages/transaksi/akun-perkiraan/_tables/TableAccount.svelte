<script lang="ts">
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import { getAccountContext } from "__@modules/accounting";

  import TrashIcon from "__@comps/icons/Trash.svelte";
  import EditIcon from "__@comps/icons/Edit.svelte";
  import AccountCell from "__@comps/account/CellAccount.svelte";

  let _removeAlert = writable(false);
  const { remove, accountStore } = getAccountContext();

  function removeAlertOpen(ui) {
    $_removeAlert = true;
    // $uiStore.modalOpen = true;
  }
  function createUpdateHandler(id) {
    return () => {
      $goto("./:id/update", { id });
    };
  }

  function createRemoveHandler(id) {
    return () => {
      $goto("./:id/remove", { id });
      // removeAlertOpen();
      // remove(id);
    };
  }
</script>

<table class="table table-togglable table-hover">
  <thead>
    <tr>
      <th style="width: 100px" data-toggle="true">Kode</th>
      <th>Nama</th>
      <th style="width: 200px">Parent</th>
      <th class="text-center" style="width: 20px">#</th>
    </tr>
  </thead>
  <tbody>
    {#each $accountStore as account (account.id)}
      <tr>
        <td>{account.id || ''}</td>
        <td>{account.name || ''}</td>
        <td>
          <AccountCell id={account.parentId} />
        </td>
        <td class="text-center">
          <span class="list-icons">
            <button
              type="button"
              on:click={createUpdateHandler(account.id)}
              class="btn btn-sm btn-outline btn-icon alpha-primary text-primary">
              <EditIcon />
            </button>
            <button
              type="button"
              on:click={createRemoveHandler(account.id)}
              class="btn btn-sm btn-outline btn-icon alpha-danger text-danger">
              <TrashIcon />
            </button>
          </span>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
