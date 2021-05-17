<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getTransactionContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { notify, loading } = getApplicationContext();
  const { remove, getTransaction } = getTransactionContext();
  const { isRemoveOwnGranted } = getAclContext();

  let transaction;

  $: {
    transaction = getTransaction($params.id);
    if ($transaction) {
      if (!isRemoveOwnGranted($transaction.userId)) {
        $goto("/access-denied");
      }
    }
  }

  async function removeHandler() {
    try {
      $loading = true;
      await remove($transaction.id);
      $goto("../");
      notify(`transaksi id '${$transaction.id}' berhasil dihapus`, "success");
      $loading = false;
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

{#if $transaction && isRemoveOwnGranted($transaction.userId) }
  <Modal open title="Hapus Content">
    <div class="alert alert-warning alert-styled-left">
      Menghapus transaksi akan menhapus transaksi setelahnya. Apa anda yakin akan menghapus transaksi id `{$transaction.id}`?
    </div>
    <svelte:fragment slot="footer">
      <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
      <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
    </svelte:fragment>
  </Modal>
{/if}
