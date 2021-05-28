<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import DetailAccount from "../_components/DetailAccount.svelte";

  const { getAccount } = stores.getAccountContext();

  export let to = "../";

  $: account = getAccount($params.id);

  function closeHandler() {
    $goto(to, {});
  }
</script>

{#if $account}
  <Modal title="Akun Perkiraan" onClose={closeHandler}>
    <DetailAccount account={$account} />
    <svelte:fragment slot="footer">
      <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
        Close
      </button>
    </svelte:fragment>
  </Modal>
{/if}
