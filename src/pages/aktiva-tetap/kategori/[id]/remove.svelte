<!--routify:options title="Hapus Kategori Aktiva Tetap"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { removeGranted } = getAclContext();
  const { removeCategory, getCategoryInventory, categoryInventoryStore, inventoryStore } = stores.getInventoryContext();
  const { loading, notify } = getApplicationContext();
  let openDialog, categoryInventory, name;

  if (!removeGranted) {
    $goto("/access-denied");
  }

  $: {
    if ($categoryInventoryStore && openDialog) {
      categoryInventory = getCategoryInventory($params.id);
      if (categoryInventory) {
        openDialog();
        name = categoryInventory.name;
      }
    }
  }

  async function removeHandler() {
    $loading = true;
    try {
      // cek apakah kategori msh memiliki data inventory
      if ($inventoryStore.some((_) => _.categoryId === categoryInventory.id)) {
        throw new Error(
          `tidak dapat menghapus kategori '${name}' karena masih terdapat data aktiva tetap pada kategori ini`
        );
      }
      await removeCategory($params.id);
      $loading = false;
      $goto("../");
      notify(`berhasil menghapus data katagori '${name}'`, "success");
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

<Modal title="Hapus Kategori Aktiva Tetap" bind:openDialog onClose={closeHandler}>
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus kategori "{name}"?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
