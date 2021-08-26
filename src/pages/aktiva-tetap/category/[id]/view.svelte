<!--routify:options title="Detail Kategori Aktiva Tetap"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import CategoryInventoryView from "../../_components/CategoryInventoryView.svelte";

  const { getCategoryInventory, categoryInventoryStore } = stores.getInventoryContext();

  let openDialog, categoryInventory;

  $: {
    if ($categoryInventoryStore && openDialog) {
      categoryInventory = getCategoryInventory($params.id);
      if (categoryInventory) {
        openDialog();
      }
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal title="Kategori Aktiva Tetap" bind:openDialog onClose={closeHandler}>
  <CategoryInventoryView {categoryInventory} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
