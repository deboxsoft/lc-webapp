<!--routify:options title="Detail Aktiva Tetap"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import InventoryView from "../../_components/InventoryView.svelte";

  const { getInventory, inventoryStore } = stores.getInventoryContext();

  export let to = "../";
  let openDialog, inventory;

  $: {
    if ($inventoryStore && openDialog) {
      inventory = getInventory($params.id);
      if (inventory) {
        openDialog();
      }
    }
  }

  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal title="Aktiva Tetap" bind:openDialog onClose={closeHandler}>
  <InventoryView {inventory} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
