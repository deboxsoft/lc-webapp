<!--routify:options title="Detail Bdd"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import BddView from "../../_components/BddView.svelte";

  const { getBdd, bddStore } = stores.getBddContext();

  export let to = "../";
  let openDialog, bdd;

  $: {
    if ($bddStore && openDialog) {
      bdd = getBdd($params.id);
      if (bdd) {
        openDialog();
      }
    }
  }

  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal title="Bdd" bind:openDialog onClose={closeHandler}>
  <BddView {bdd} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
