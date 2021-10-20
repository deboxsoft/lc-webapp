<!--routify:options title="Detail Aktiva Tetap"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import InventoryView from "../../_components/InventoryView.svelte";

  const { inventoryDetail } = stores.getInventoryContext();

  export let to = "../";
  let openDialog, inventory;

  inventoryDetail($params.id).then((_) => {
    inventory = _;
    openDialog();
  });

  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal class="modal-lg" title="Aktiva Tetap" bind:openDialog onClose={closeHandler}>
  <InventoryView {inventory} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
