<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getTransactionContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";

  const { notify, loading } = getApplicationContext();
  const { remove } = getTransactionContext();

  $: transactionId = $params.id;

  async function removeHandler() {
    try {
      $loading = true;
      await remove(transactionId);
      $goto("../");
      notify(`transaksi id '${transactionId}' berhasil dihapus`, "success");
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

<Modal open title="Hapus Content">
  <div class="alert alert-warning alert-styled-left">
    Menghapus transaksi akan menhapus transaksi setelahnya. Apa anda yakin akan menghapus transaksi id `{transactionId}`?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
