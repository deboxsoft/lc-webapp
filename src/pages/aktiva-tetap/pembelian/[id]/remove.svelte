<!--routify:options title="Hapus Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { notify, loading } = getApplicationContext();
  const { remove, inventoryTransactionStore } = stores.getInventoryTransactionContext();
  const { removeGranted } = getAclContext();

  let inventoryTransaction,
    openDialog,
    ready = false;

  $: {
    if (!ready && $inventoryTransactionStore && openDialog) {
      ready = true;
      const i = $inventoryTransactionStore.findIndex((_) => _.id === $params.id);
      inventoryTransaction = $inventoryTransactionStore[i];
      if (inventoryTransaction) {
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
      const id = inventoryTransaction.id;
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

<Modal title="Hapus Data" onClose={closeHandler} bind:openDialog loading={!inventoryTransaction}>
  <div class="alert alert-warning alert-styled-left">Apa anda yakin akan menghapus data ini?</div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
