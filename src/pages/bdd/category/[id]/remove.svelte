<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { removeGranted } = getAclContext();
  const { removeCategory, getAmortization } = stores.getBddContext();
  const { loading, notify } = getApplicationContext();

  if (!removeGranted) {
    $goto("/access-denied");
  }

  async function removeHandler() {
    $loading = true;
    try {
      await remove($params.id);
      $loading = false;
      $goto("../");
      notify(`berhasil menghapus data katagori '${$categoryAmortization.name}'`);
    } catch (e) {
      if (e.message) {
        notify(e.message, "error")
      }
      $loading = false;
    }
  }

  $: categoryAmortization = getBank($params.id);

  function closeHandler() {
    $goto("../");
  }
</script>

{#if $categoryAmortization}
  <Modal open title="Hapus Kategori Amortisasi" onClose={closeHandler}>
    <div class="alert alert-warning alert-styled-left">
      Apa anda yakin akan menghapus amortiasi "{$categoryAmortization.name}"?
    </div>
    <svelte:fragment slot="footer">
      <button class="btn btn-link text-warning" on:click={closeHandler}>Tutup</button>
      <button class="btn bg-warning" on:click={removeHandler}>Hapus</button>
    </svelte:fragment>
  </Modal>
{/if}