<!--routify:options title="Hapus Inventaris"-->
<script>
  import { InventoryRemoveInputSchema } from "@deboxsoft/accounting-api";
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";
  import InventoryRemove from "../../_components/InventoryRemove.svelte";
  import { writable } from "svelte/store";

  const { removeGranted } = getAclContext();
  const { remove, getInventory, inventoryStore } = stores.getInventoryContext();
  const { loading, notify } = getApplicationContext();
  if (!removeGranted) {
    $goto("/access-denied");
  }

  let openDialog,
    closeDialog,
    inventory,
    isValid = writable(false),
    submitting,
    fields,
    values = {};
  $: {
    if ($inventoryStore && openDialog) {
      inventory = getInventory($params.id);
      if (inventory) {
        if (!inventory.logs || inventory.logs.length === 0) {
          $isValid = true;
        }
        openDialog();
      }
    }
  }

  async function removeHandler() {
    try {
      $loading = true;
      submitting = true;
      const name = inventory.name;
      const input = inventory.logs && InventoryRemoveInputSchema.parse(values) || undefined;
      await remove($params.id, input);
      closeDialog();
      $goto("../");
      notify(`berhasil menghapus barang '${name}'`, "success");
    } catch (e) {
      if (e.message) {
        notify(e.message, "error");
      }
    } finally {
      $loading = false;
      submitting = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal bind:openDialog bind:closeDialog title="Hapus Inventaris" onClose={closeHandler}>
  <InventoryRemove inventory={{...inventory}} schema={InventoryRemoveInputSchema} />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler} disabled={!$isValid || submitting}>Hapus</button>
  </svelte:fragment>
</Modal>
