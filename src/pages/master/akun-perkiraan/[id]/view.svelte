<!--routify:options title="Detail Akun"-->

<script>
  import { onMount } from "svelte";
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import DetailAccount from "../_components/DetailAccount.svelte";

  const { getAccount } = stores.getAccountContext();

  export let to = "../";

  let openDialog;

  $: account = getAccount($params.id);

  onMount(() => {
    openDialog();
  });
  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal title="Akun Perkiraan" onClose={closeHandler} bind:openDialog>
  {#if $account}
    <DetailAccount account={$account} />
  {/if}
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
