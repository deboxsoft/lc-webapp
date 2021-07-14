<script>
  import { onMount } from "svelte";
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { notify, loading } = getApplicationContext();
  const { remove, getTransaction } = stores.getTransactionContext();
  const { removeGranted } = getAclContext();

  let transaction, openDialog;

  onMount(() => {
    openDialog();
  });

  $: {
    transaction = getTransaction($params.id);
    if ($transaction) {
      if (!removeGranted($transaction.userId)) {
        $goto("/access-denied");
      }
    }
  }

  async function removeHandler() {
    try {
      $loading = true;
      const id = $transaction.id;
      await remove(id);
      // await Promise.resolve();
      $loading = false;
      closeHandler();
      notify(`transaksi id '${id}' berhasil dihapus`, "success");
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal title="Hapus Content" onClose={closeHandler} bind:openDialog>
  {#if $transaction}
    <div class="alert alert-warning alert-styled-left">
      Menghapus transaksi akan menhapus transaksi setelahnya. Apa anda yakin akan menghapus transaksi id `{$transaction.id}`?
    </div>
  {/if}
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
