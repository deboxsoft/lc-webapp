<!--routify:options title="Hapus Kategori Barang"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { removeGranted } = getAclContext();
  const { remove, getCategoryProduct, categoryProductStore } = stores.getCategoryProductContext();
  const { loading, notify } = getApplicationContext();
  let openDialog,
    categoryProduct,
    name,
    ready = false;

  if (!removeGranted) {
    $goto("/access-denied");
  }

  $: {
    if (!ready && $categoryProductStore && openDialog) {
      ready = true;
      categoryProduct = getCategoryProduct($params.id);
      name = categoryProduct.name;
      if (categoryProduct) {
        openDialog();
      }
    }
  }

  async function removeHandler() {
    $loading = true;
    try {
      // cek apakah kategori msh memiliki data inventory
      await remove($params.id);
      $loading = false;
      notify(`berhasil menghapus data katagori '${name}'`, "success");
      $goto("../");
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

<Modal title="Hapus Kategori Barang" bind:openDialog onClose={closeHandler}>
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus kategori "{name}"?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
