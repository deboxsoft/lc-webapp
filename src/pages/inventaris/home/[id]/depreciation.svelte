<!--routify:options title="Rekap Depresiasi Inventaris"-->

<script>
  import { goto, params } from "@roxi/routify";
  import DepreciationTable from "../../_components/DepreciationTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import Modal from "../../../../components/Modal.svelte";

  const { getInventory, inventoryStore, categoryInventoryStore } = stores.getInventoryContext();
  let openDialog, inventory;

  $: {
    if ($inventoryStore && $categoryInventoryStore && openDialog) {
      inventory = getInventory($params.id);
      if (inventory) {
        openDialog();
      }
    }
  }

  function closeHandler() {
    $goto("../");
  }

</script>
<Modal bind:openDialog title={`Rekap Akumulasi Depresiasi ${inventory?.name}`} onClose={closeHandler}>
    <DepreciationTable {inventory} />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
  </svelte:fragment>
</Modal>
