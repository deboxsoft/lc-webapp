<!--routify:options title="Detail Data"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../components/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import DetailCategoryInventory from "../_components/ViewStock.svelte";
  import { onMount } from "svelte";

  const { getBdd } = stores.getBddContext();

  export let to = "../";
  let openDialog;

  onMount(() => {
    openDialog();
  });

  $: bdd = getBdd($params.id);

  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal title="Inventaris" bind:openDialog onClose={closeHandler}>
  {#if $bdd}
    <DetailCategoryInventory categoryInventory={$bdd} />
  {/if}
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
