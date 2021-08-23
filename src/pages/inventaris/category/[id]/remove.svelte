<!--routify:options title="Hapus Kategori Inventaris"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { removeGranted } = getAclContext();
  const { removeCategory, getCategoryInventory, categoryInventoryStore, inventoryStore } = stores.getInventoryContext();
  const { loading, notify } = getApplicationContext();
  let openDialog, categoryInventory;

  if (!removeGranted) {
    $goto("/access-denied");
  }

  $: {
    if ($categoryInventoryStore && openDialog) {
      categoryInventory = getCategoryInventory($params.id);
      if (categoryInventory) {
        openDialog();
      }
    }
  }

  async function removeHandler() {
    $loading = true;
    try {
      // cek apakah kategori msh memiliki data inventory
      const name = categoryInventory.name;
      if ($inventoryStore.some((_) => _.categoryId === categoryInventory.id)) {
        throw new Error(
          `tidak dapat menghapus kategori '${name}' karena masih terdapat data inventaris pada kategori ini`
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

<Modal title="Hapus Kategori Inventaris" bind:openDialog onClose={closeHandler}>
  <div class="alert alert-warning alert-styled-left">
    Apa anda yakin akan menghapus kategori "{categoryInventory.name}"?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
