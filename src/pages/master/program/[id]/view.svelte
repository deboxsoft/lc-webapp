<script>
  import { onMount } from "svelte";
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getProgramContext } from "@deboxsoft/lc-cashier-client";
  import DetailProgram from "../_components/ProgramView.svelte";

  const { programStore, getProgram } = getProgramContext();

  export let to = "../";

  let openDialog;

  $: program = $programStore && getProgram($params.id);

  onMount(() => {
    openDialog();
  });
  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal title="Program" onClose={closeHandler} bind:openDialog>
  {#if $program}
    <DetailProgram program={$program} />
  {/if}
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
