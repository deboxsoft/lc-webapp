<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import DetailCategoryInventory from "../_components/DetailCategoryInventory.svelte";

  const { getCategoryInventory } = stores.getInventoryContext();

  export let to = "../";

  $: categoryInventory = getInventoryContext($params.category);

  function closeHandler() {
    $goto(to, {});
  }
</script>

{#if $categoryInventory}
  <Modal title="Kategori Inventaris" onClose={closeHandler}>
    <DetailCategoryInventory categoryInventory={$categoryInventory} />
    <svelte:fragment slot="footer">
      <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
        Close
      </button>
    </svelte:fragment>
  </Modal>
{/if}
