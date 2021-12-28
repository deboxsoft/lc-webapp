<!--routify:options title="Hapus Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { notify, loading } = getApplicationContext();
  const { remove, stockTransactionStore } = stores.getStockTransactionContext();
  const { removeGranted } = getAclContext();

  let stockTransaction, openDialog, ready = false;


  $: {
    if (!ready && $stockTransactionStore && openDialog) {
      ready = true;
      const i = $stockTransactionStore.findIndex(_ => _.id === $params.id);
      stockTransaction = $stockTransactionStore[i];
      if (stockTransaction) {
        if (!removeGranted) {
          $goto("/access-denied");
        } else {
          openDialog();
        }
      }
    }
  }

  async function removeHandler() {
    try {
      $loading = true;
      const id = stockTransaction.id;
      await remove(id);
      // await Promise.resolve();
      $loading = false;
      closeHandler();
      notify(`data berhasil dihapus`, "success");
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal title="Hapus Data" onClose={closeHandler} bind:openDialog loading={!stockTransaction}>
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus data ini?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
