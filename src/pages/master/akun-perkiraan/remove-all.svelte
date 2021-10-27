<!--routify:options title="Hapus Akun"-->
<script>
  import { onMount } from "svelte";
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "./_acl-context";

  const { removeAll } = stores.getAccountContext();
  const { notify, loading } = getApplicationContext();
  const { removeGranted } = getAclContext();
  if (!removeGranted) {
    $goto("/access-denied");
  }

  let openDialog;

  onMount(() => {
    openDialog();
  });

  async function removeHandler() {
    try {
      $loading = true;
      await removeAll();
      closeHandler()
      notify(`Semua akun berhasil dihapus`, "success");
      $loading = false;
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("./");
  }
</script>

<Modal title="Hapus Semua Akun" onClose={closeHandler} bind:openDialog>
  <div class="alert alert-warning alert-styled-left">
    Menghapus semua akun akan menghapus semua transaksi. Apa anda yakin akan menghapus semua akun?
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
