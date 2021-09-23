<!--routify:options title="Hapus Data Barang"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { removeGranted } = getAclContext();
  const { remove, getProduct, productStore } = stores.getProductContext();
  const { loading, notify } = getApplicationContext();
  let openDialog, product, name, ready = false;

  if (!removeGranted) {
    $goto("/access-denied");
  }

  $: {
    if (!ready && $productStore && openDialog) {
      ready = true;
      product = getProduct($params.id);
      if (product) {
        name = product.name;
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
      notify(`berhasil menghapus data barang '${name}'`, "success");
    } catch (e) {
      console.error(e);
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

<Modal title="Hapus Data Supplier" bind:openDialog onClose={closeHandler}>
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus kategori "{name}"?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
