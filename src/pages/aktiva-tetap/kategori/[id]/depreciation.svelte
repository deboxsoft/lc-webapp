<!--routify:options title="Rekap Depresiasi Kategori Aktiva Tetap"-->

<script>
  import { goto, params } from "@roxi/routify";
  import DepreciationTable from "../../_components/DepreciationTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import Modal from "__@comps/Modal.svelte";
  import CategoryDepreciationTable from "../../_components/CategoryDepreciationTable.svelte";

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

<Modal bind:openDialog title="Rekap Akumulasi Depresiasi Kategori Aktiva Tetap" onClose={closeHandler}>
  <CategoryDepreciationTable {categoryInventory} />
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
  </svelte:fragment>
</Modal>
