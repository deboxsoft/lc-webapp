<!--routify:options title="Hapus Supplier"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { removeGranted } = getAclContext();
  const { remove, getSupplier, supplierStore } = stores.getSupplierContext();
  const { loading, notify } = getApplicationContext();
  let openDialog, supplier, name, booting = true;

  if (!removeGranted) {
    $goto("/access-denied");
  }

  $: {
    if (booting && $supplierStore && openDialog) {
      booting = false;
      supplier = getSupplier($params.id);
      if (supplier) {
        name = supplier.name;
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
      notify(`berhasil menghapus data supplier '${name}'`, "success");
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
