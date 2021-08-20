<!--routify:options title="Detail Inventaris"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import DetailCategoryInventory from "../../_components/ViewCategoryInventory.svelte";
  import { onMount } from "svelte";

  const { getInventory } = stores.getInventoryContext();

  export let to = "../";
  let openDialog;

  onMount(() => {
    openDialog();
  });

  $: inventory = getInventory($params.id);

  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal title="Inventaris" bind:openDialog onClose={closeHandler}>
  {#if $inventory}
    <DetailCategoryInventory categoryInventory={$inventory} />
  {/if}
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
