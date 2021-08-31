<!--routify:options title="Hapus Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../components/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  let openDialog, stock, name;

  const { removeGranted } = getAclContext();
  const { remove, stockStore, getStock } = stores.getStockTransferContext();
  const { loading, notify } = getApplicationContext();

  if (!removeGranted) {
    $goto("/access-denied");
  }

  $: {
    if ($stockStore && openDialog) {
      stock = getStock($params.id);
      if (stock) {
        name = stock.name;
        openDialog();
      }
    }
  }

  async function removeHandler() {
    $loading = true;
    try {
      await remove($params.id);
      $loading = false;
      $goto("../");
      notify(`berhasil menghapus barang '${name}'`);
    } catch (e) {
      if (e.message) {
        notify(e.message, "error");
      }
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal bind:openDialog title="Hapus Barang" onClose={closeHandler}>
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus barang "{name}"?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
