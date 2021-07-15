<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import ViewAmortization from "../../_components/ViewCategoryAmortization.svelte";

  const { getAmortization } = stores.getBddContext();

  export let to = "../";

  $: categoryAmortisasi = getAmortization($params.category);

  function closeHandler() {
    $goto(to, {});
  }
</script>

{#if $categoryAmortisasi}
  <Modal title="Kategori Amortisasi" onClose={closeHandler}>
    <ViewAmortization categoryInventory={$categoryAmortisasi} />
    <svelte:fragment slot="footer">
      <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
        Close
      </button>
    </svelte:fragment>
  </Modal>
{/if}
