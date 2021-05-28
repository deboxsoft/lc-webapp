<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import DetailCategoryInventory from "../_components/DetailCategoryInventory.svelte";

  const { getInventory } = stores.getInventoryContext();

  export let to = "../";

  $: inventory = getInventoryContext($params.id);

  function closeHandler() {
    $goto(to, {});
  }
</script>

{#if $inventory}
  <Modal title="Inventaris" onClose={closeHandler}>
    <DetailCategoryInventory categoryInventory={$inventory} />
    <svelte:fragment slot="footer">
      <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
        Close
      </button>
    </svelte:fragment>
  </Modal>
{/if}
