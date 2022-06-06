<!--routify:options title="Hapus Data"-->
<script>
  import { onMount } from "svelte";
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getCashierContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { notify, loading } = getApplicationContext();
  const { remove, getCashier, cashierStore } = getCashierContext();
  const { removeGranted } = getAclContext();

  let cashier, openDialog;

  onMount(() => {
    openDialog();
  });

  $: {
    if ($cashierStore) {
      cashier = getCashier($params.id);
      if (cashier) {
        if (!removeGranted) {
          $goto("/access-denied");
        }
      }
    }
  }

  async function removeHandler() {
    try {
      $loading = true;
      const id = cashier.id;
      await remove(id);
      $loading = false;
      closeHandler();
      notify(`Data id '${id}' berhasil dihapus`, "success");
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

<Modal bind:openDialog title="Hapus Content" onClose={closeHandler}>
  {#if cashier}
    <div class="alert alert-warning alert-styled-left">
      Apa anda yakin akan menghapus data id `{cashier.id}`?
    </div>
  {/if}
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
  </svelte:fragment>
</Modal>
